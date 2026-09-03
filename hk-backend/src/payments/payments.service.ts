import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { PaymentProviderFactory } from './providers/provider.factory';
import { ProviderStatusInfo } from './providers/payment-provider.interface';
import { QueuesService } from '../queues/queues.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private providerFactory: PaymentProviderFactory,
    private queuesService: QueuesService,
  ) {}

  getProviderStatus(): ProviderStatusInfo {
    return this.providerFactory.getActiveProviderStatus();
  }

  async initiatePayment(orderId: string, customGateway?: string, idempotencyKey?: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID "${orderId}" not found`);
      }

      if (order.orderStatus === OrderStatus.CANCELLED) {
        throw new BadRequestException('Cannot initiate payment for a cancelled order');
      }

      if (order.paymentStatus === PaymentStatus.COMPLETED) {
        throw new BadRequestException('Payment has already been completed for this order');
      }

      const provider = this.providerFactory.getProvider(customGateway);

      // Request Idempotency Check
      if (idempotencyKey) {
        const existingPayment = await this.prisma.payment.findUnique({
          where: { idempotencyKey },
        });

        if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
          return {
            message: 'Payment session already completed (Idempotent)',
            provider: provider.name,
            transactionRef: existingPayment.transactionRef,
            status: existingPayment.status,
          };
        }
      }

      const transactionRef = `TXN-${order.orderNumber}-${Date.now().toString().slice(-4)}`;
      const storefrontUrl = this.configService.get<string>('STOREFRONT_URL') || 'https://hk-ecom-store.vercel.app';
      const backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:5000';

      const returnUrl = `${storefrontUrl}/order-confirmation?orderNumber=${order.orderNumber}&orderId=${order.id}`;
      const cancelUrl = `${storefrontUrl}/checkout?cancelledOrder=${order.orderNumber}`;
      const webhookUrl = `${backendUrl}/payments/webhook`;

      // Record initiated payment record in database
      const paymentRecord = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          provider: provider.name,
          amount: order.totalAmount,
          currency: 'PKR',
          paymentMethod: customGateway || provider.name,
          transactionRef,
          idempotencyKey: idempotencyKey || null,
          status: PaymentStatus.INITIATED,
          initiatedAt: new Date(),
        },
      });

      const initiationResult = await provider.initiatePayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.totalAmount,
        currency: 'PKR',
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        transactionRef,
        returnUrl,
        cancelUrl,
        webhookUrl,
      });

      return {
        ...initiationResult,
        paymentId: paymentRecord.id,
        orderNumber: order.orderNumber,
      };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
      this.logger.error(`Initiate payment error for order ${orderId}: ${err.message}`);
      throw new BadRequestException(`Failed to initiate payment session: ${err.message}`);
    }
  }

  async verifyWebhook(body: any, headers?: Record<string, any>, query?: any, customGateway?: string) {
    try {
      const provider = this.providerFactory.getProvider(customGateway);
      const verification = await provider.verifyWebhook(body, headers, query);

      if (!verification.isValid) {
        this.logger.warn(`Tampered or invalid payment webhook signature rejected: ${verification.errorMessage}`);
        throw new UnauthorizedException(verification.errorMessage || 'Invalid payment webhook signature verification');
      }

      const { orderId, transactionRef, status, rawResponse } = verification;

      if (!orderId && !transactionRef) {
        throw new BadRequestException('Webhook payload missing orderId or transactionRef');
      }

      // Execute DB Transaction for Webhook Processing & Idempotency
      return await this.prisma.$transaction(async (tx) => {
        // 1. Transaction Uniqueness / Idempotency check
        const existingTxn = await tx.payment.findFirst({
          where: {
            OR: [
              { transactionRef: transactionRef || undefined },
              { orderId: orderId || undefined, status: PaymentStatus.COMPLETED },
            ],
          },
        });

        if (existingTxn && existingTxn.status === PaymentStatus.COMPLETED && status === 'COMPLETED') {
          this.logger.log(`Duplicate webhook ignored for transactionRef: ${transactionRef || orderId}`);
          return { message: 'Webhook already processed (Idempotent)', verified: true, payment: existingTxn };
        }

        // 2. Locate active or create payment record
        let paymentRecord = await tx.payment.findFirst({
          where: {
            OR: [
              { transactionRef: transactionRef || undefined },
              { orderId: orderId || undefined, status: PaymentStatus.INITIATED },
            ],
          },
        });

        const mappedStatus =
          status === 'COMPLETED'
            ? PaymentStatus.COMPLETED
            : status === 'CANCELLED'
            ? PaymentStatus.CANCELLED
            : PaymentStatus.FAILED;

        if (paymentRecord) {
          paymentRecord = await tx.payment.update({
            where: { id: paymentRecord.id },
            data: {
              status: mappedStatus,
              gatewayResponse: JSON.stringify(rawResponse || {}),
              completedAt: mappedStatus === PaymentStatus.COMPLETED ? new Date() : null,
              failedAt: mappedStatus === PaymentStatus.FAILED ? new Date() : null,
            },
          });
        } else if (orderId) {
          const targetOrder = await tx.order.findUnique({ where: { id: orderId } });
          if (targetOrder) {
            paymentRecord = await tx.payment.create({
              data: {
                orderId: targetOrder.id,
                provider: provider.name,
                amount: targetOrder.totalAmount,
                currency: 'PKR',
                paymentMethod: provider.name,
                transactionRef: transactionRef || `TXN-WH-${Date.now()}`,
                gatewayResponse: JSON.stringify(rawResponse || {}),
                status: mappedStatus,
                completedAt: mappedStatus === PaymentStatus.COMPLETED ? new Date() : null,
                failedAt: mappedStatus === PaymentStatus.FAILED ? new Date() : null,
              },
            });
          }
        }

        // 3. State Machine Transition: Update Order if payment is COMPLETED
        if (mappedStatus === PaymentStatus.COMPLETED && paymentRecord?.orderId) {
          await tx.order.update({
            where: { id: paymentRecord.orderId },
            data: {
              paymentStatus: PaymentStatus.COMPLETED,
              orderStatus: OrderStatus.PROCESSING,
            },
          });

          await tx.orderStatusHistory.create({
            data: {
              orderId: paymentRecord.orderId,
              status: OrderStatus.PROCESSING,
              note: `Payment COMPLETED via ${provider.name} server verification (TXN: ${transactionRef})`,
              updatedBy: `System (${provider.name} Webhook)`,
            },
          });
        } else if (mappedStatus === PaymentStatus.FAILED && paymentRecord?.orderId) {
          await tx.order.update({
            where: { id: paymentRecord.orderId },
            data: {
              paymentStatus: PaymentStatus.FAILED,
            },
          });
        }

        const result = {
          message: `Payment webhook verified & processed as ${mappedStatus}`,
          verified: true,
          status: mappedStatus,
          payment: paymentRecord,
        };

        // Non-blocking background queue trigger after DB transaction commit
        if (mappedStatus === PaymentStatus.COMPLETED && paymentRecord?.orderId) {
          this.prisma.order
            .findUnique({
              where: { id: paymentRecord.orderId },
              include: { items: true },
            })
            .then((fullOrder) => {
              if (fullOrder) {
                this.queuesService.enqueueOrderConfirmation({
                  orderId: fullOrder.id,
                  orderNumber: fullOrder.orderNumber,
                  customerEmail: fullOrder.customerEmail,
                  customerName: fullOrder.customerName,
                  totalAmount: fullOrder.totalAmount,
                  shippingAddress: fullOrder.shippingAddress,
                  city: fullOrder.city,
                  items: fullOrder.items,
                });

                this.queuesService.enqueuePaymentConfirmation({
                  orderId: fullOrder.id,
                  orderNumber: fullOrder.orderNumber,
                  transactionRef: paymentRecord.transactionRef || fullOrder.orderNumber,
                  provider: paymentRecord.provider,
                  customerEmail: fullOrder.customerEmail,
                  customerName: fullOrder.customerName,
                  amount: fullOrder.totalAmount,
                });
              }
            })
            .catch(() => null);
        }

        return result;
      }, { timeout: 15000, maxWait: 10000 });
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) throw err;
      this.logger.error(`Webhook verification error: ${err.message}`);
      throw new BadRequestException(`Webhook processing failed: ${err.message}`);
    }
  }

  async verifyOrderPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      return {
        verified: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: PaymentStatus.COMPLETED,
        orderStatus: order.orderStatus,
        message: 'Order payment verified server-side as COMPLETED',
      };
    }

    const latestPayment = order.payments[0];
    if (latestPayment && latestPayment.transactionRef) {
      const provider = this.providerFactory.getProvider(latestPayment.provider);
      const queryResult = await provider.queryTransactionStatus(latestPayment.transactionRef, orderId);

      if (queryResult.status === 'COMPLETED') {
        await this.prisma.$transaction([
          this.prisma.payment.update({
            where: { id: latestPayment.id },
            data: { status: PaymentStatus.COMPLETED, completedAt: new Date() },
          }),
          this.prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: PaymentStatus.COMPLETED, orderStatus: OrderStatus.PROCESSING },
          }),
        ]);

        return {
          verified: true,
          orderId: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: PaymentStatus.COMPLETED,
          orderStatus: OrderStatus.PROCESSING,
          message: 'Order payment query verified server-side as COMPLETED',
        };
      }
    }

    return {
      verified: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      message: 'Order payment remains PENDING or UNPAID server-side',
    };
  }

  async retryPayment(orderId: string, customGateway?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment is already COMPLETED for this order. Retry is not needed.');
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot retry payment for a cancelled order.');
    }

    this.logger.log(`Initiating retry payment for order ${order.orderNumber}`);
    return this.initiatePayment(orderId, customGateway);
  }

  async refundOrder(orderId: string, amount?: number, reason?: string, restoreInventory = false) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: { where: { status: PaymentStatus.COMPLETED } } },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (order.paymentStatus === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Order has already been refunded. Duplicate refund prevented.');
    }

    const completedPayment = order.payments[0];
    const refundAmount = amount || order.totalAmount;

    if (refundAmount > order.totalAmount) {
      throw new BadRequestException(`Refund amount (PKR ${refundAmount}) cannot exceed total order amount (PKR ${order.totalAmount})`);
    }

    const provider = this.providerFactory.getProvider(completedPayment?.provider);

    const refundResult = await provider.processRefund({
      orderId: order.id,
      transactionRef: completedPayment?.transactionRef || `TXN-${order.orderNumber}`,
      amount: refundAmount,
      reason,
    });

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update Order & Payment status
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.REFUNDED,
          orderStatus: OrderStatus.REFUNDED,
        },
      });

      if (completedPayment) {
        await tx.payment.update({
          where: { id: completedPayment.id },
          data: { status: PaymentStatus.REFUNDED },
        });
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: OrderStatus.REFUNDED,
          note: `Refund of PKR ${refundAmount} processed via ${provider.name}. Reason: ${reason || 'N/A'}. Inventory Restored: ${restoreInventory}`,
          updatedBy: 'Admin User',
        },
      });

      // 2. Conditionally restore inventory only if restoreInventory is explicitly true
      if (restoreInventory) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return {
        message: `Refund of PKR ${refundAmount} completed successfully`,
        refundResult,
        inventoryRestored: restoreInventory,
      };
    });
  }
}
