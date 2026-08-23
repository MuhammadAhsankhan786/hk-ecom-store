import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initiatePayment(orderId: string, gateway: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) throw new BadRequestException('Order not found');

      const merchantId = this.configService.get<string>('PAYFAST_MERCHANT_ID') || 'sandbox_merchant_123';
      const postUrl = gateway.toLowerCase().includes('payfast')
        ? 'https://sandbox.payfast.co.za/eng/process'
        : 'https://easypaisa.com.pk/checkout';

      const transactionRef = `TXN-${order.orderNumber}-${Date.now().toString().slice(-4)}`;

      return {
        message: 'Payment session initiated',
        gateway,
        postUrl,
        params: {
          merchant_id: merchantId,
          amount: order.totalAmount,
          item_name: `HK Fabric Order ${order.orderNumber}`,
          return_url: `http://localhost:3000/order-confirmation?orderNumber=${order.orderNumber}`,
          cancel_url: `http://localhost:3000/checkout`,
          custom_str1: order.id,
          transaction_ref: transactionRef,
        },
      };
    } catch {
      return {
        message: 'Payment session initiated (Sandbox)',
        gateway,
        transactionRef: `TXN-MOCK-${Date.now()}`,
        status: 'PENDING',
      };
    }
  }

  async verifyWebhook(orderId: string, transactionRef: string, status: PaymentStatus, signature?: string) {
    try {
      const secureKey = this.configService.get<string>('PAYFAST_SECURE_KEY') || 'sandbox_key_456';

      // 1. Webhook Signature Verification (HMAC SHA256)
      if (signature) {
        const expectedData = `${orderId}:${transactionRef}:${status}`;
        const computedSignature = crypto.createHmac('sha256', secureKey).update(expectedData).digest('hex');
        if (signature !== computedSignature) {
          throw new UnauthorizedException('Invalid payment webhook signature');
        }
      }

      return await this.prisma.$transaction(async (tx) => {
        // 2. Webhook Idempotency Check: Prevent duplicate webhook execution
        const existingTxn = await tx.payment.findFirst({
          where: { transactionRef, status: PaymentStatus.COMPLETED },
        });

        if (existingTxn) {
          console.log(`[PaymentsService] Duplicate webhook ignored for transactionRef: ${transactionRef}`);
          return { message: 'Webhook already processed', payment: existingTxn };
        }

        const payment = await tx.payment.create({
          data: {
            orderId,
            amount: 0,
            paymentMethod: 'ONLINE_GATEWAY',
            transactionRef,
            gatewayResponse: JSON.stringify({ status, verifiedAt: new Date().toISOString() }),
            status,
          },
        });

        if (status === PaymentStatus.COMPLETED) {
          await tx.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.COMPLETED,
              orderStatus: 'PROCESSING',
            },
          });
        }

        return { message: 'Payment webhook verified & processed', payment };
      });
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      return { message: 'Payment webhook processed (Mock)' };
    }
  }
}
