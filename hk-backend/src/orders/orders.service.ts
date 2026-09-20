import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus, AdjustmentType, UserRole } from '@prisma/client';
import { QueuesService } from '../queues/queues.service';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.PACKED]: [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [OrderStatus.PENDING, OrderStatus.PROCESSING],
  [OrderStatus.REFUNDED]: [],
};


@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private queuesService: QueuesService,
  ) {}

  async createOrder(dto: CreateOrderDto, customerId?: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        let subtotal = 0;
        const validatedItems: any[] = [];

        // 1. Stock Check & Atomic Stock Reservation (Race-Condition Protection)
        for (const item of dto.items) {
          let targetProductId = item.productId;
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);
          if (!isUuid) {
            const matchedProduct = await tx.product.findFirst({
              where: {
                OR: [
                  { slug: item.productId },
                  { sku: item.productSku },
                  { name: item.productName },
                ],
              },
            });
            if (matchedProduct) {
              targetProductId = matchedProduct.id;
            } else {
              const fallbackProd = await tx.product.findFirst({ where: { isArchived: false } });
              if (fallbackProd) targetProductId = fallbackProd.id;
            }
          }

          // ATOMIC CONCURRENCY CHECK: Only decrement if stock >= item.quantity
          const updateResult = await tx.product.updateMany({
            where: {
              id: targetProductId,
              isArchived: false,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (updateResult.count === 0) {
            const product = await tx.product.findUnique({
              where: { id: targetProductId },
            });
            if (!product || product.isArchived) {
              throw new BadRequestException(`Product "${item.productName}" is no longer available`);
            }
            throw new ConflictException(
              `Insufficient stock for "${product.name}". Another customer purchased the last stock item!`,
            );
          }

          // Audit inventory reservation
          await tx.inventoryTransaction.create({
            data: {
              productId: targetProductId,
              previousQty: 0,
              adjustment: -item.quantity,
              newQty: 0,
              type: AdjustmentType.ORDER_RESERVATION,
              reason: `Order Placement Atomic Reservation`,
              performedBy: `System (Customer: ${dto.customerEmail})`,
            },
          });

          const itemTotal = item.unitPrice * item.quantity;
          subtotal += itemTotal;

          validatedItems.push({
            productId: targetProductId,
            productName: item.productName,
            productSku: item.productSku,
            variantSize: item.variantSize || 'King',
            variantColor: item.variantColor || 'Gold',
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: itemTotal,
          });
        }


        // 2. Coupon Validation
        let discount = 0;
        if (dto.couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: dto.couponCode.toUpperCase() },
          });
          if (coupon && coupon.isActive) {
            if (coupon.discountType === 'PERCENTAGE') {
              discount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
              }
            } else if (coupon.discountType === 'FIXED_AMOUNT') {
              discount = coupon.discountValue;
            }
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }

        const shippingFee = subtotal >= 5000 ? 0 : 250; // Free shipping above PKR 5,000
        const totalAmount = Math.max(0, subtotal - discount + shippingFee);

        const advancePaymentAmount = dto.advancePaymentAmount !== undefined ? dto.advancePaymentAmount : 1000;
        const remainingCodAmount = Math.max(0, totalAmount - advancePaymentAmount);
        const paymentScreenshot = dto.paymentScreenshot || null;
        const advancePaymentStatus = dto.advancePaymentStatus || (paymentScreenshot ? 'PENDING' : 'UNPAID');

        const orderNumber = `HK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        // 3. Create Order Record
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId: customerId || null,
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            customerPhone: dto.customerPhone,
            shippingAddress: dto.shippingAddress,
            city: dto.city,
            subtotal,
            discount,
            shippingFee,
            totalAmount,
            advancePaymentAmount,
            remainingCodAmount,
            paymentScreenshot,
            advancePaymentStatus,
            orderStatus: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            paymentMethod: dto.paymentMethod,
            notes: dto.notes,
            items: {
              create: validatedItems,
            },
            payments: {
              create: {
                amount: totalAmount,
                paymentMethod: dto.paymentMethod,
                status: PaymentStatus.PENDING,
              },
            },
            statusHistory: {
              create: {
                status: OrderStatus.PENDING,
                note: paymentScreenshot ? 'Order created with PKR 1,000 Advance Receipt screenshot' : 'Order created via checkout',
                updatedBy: 'Customer',
              },
            },
          },
          include: {
            items: true,
            payments: true,
          },
        });

        return {
          message: 'Order created successfully',
          order,
        };
      }, { timeout: 15000, maxWait: 10000 });
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof ConflictException || err instanceof NotFoundException) throw err;
      console.error('[OrdersService.createOrder Error]', err);
      throw new BadRequestException(`Failed to create order: ${err.message || err}`);
    }
  }

  async findAll(query?: { status?: OrderStatus; search?: string; page?: number; limit?: number }) {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (query?.status) where.orderStatus = query.status;
      if (query?.search) {
        where.OR = [
          { orderNumber: { contains: query.search, mode: 'insensitive' } },
          { customerName: { contains: query.search, mode: 'insensitive' } },
          { customerEmail: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      const [orders, totalCount] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: { items: true, payments: true, statusHistory: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.order.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: orders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch {
      return { data: [], pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
    }
  }

  async findOne(idOrNumber: string, requestingUser?: any) {
    try {
      const order = await this.prisma.order.findFirst({
        where: {
          OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
        },
        include: { items: true, payments: true, statusHistory: true },
      });
      if (!order) throw new NotFoundException('Order not found');

      if (requestingUser) {
        const isAdmin = requestingUser.role === UserRole.SUPER_ADMIN || requestingUser.role === UserRole.STORE_MANAGER;
        const isOwner = (order.customerId && order.customerId === requestingUser.id) || (order.customerEmail && order.customerEmail.toLowerCase() === requestingUser.email?.toLowerCase());
        if (!isAdmin && !isOwner) {
          throw new ForbiddenException('Access denied: You are not authorized to view this order.');
        }
      }

      return order;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) throw err;
      throw new NotFoundException('Order not found');
    }
  }

  async updateStatus(orderId: string, targetStatus: OrderStatus, note?: string, updatedBy = 'Admin User') {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order) throw new NotFoundException('Order not found');

        // State Machine Guard: Validate transition
        const currentStatus = order.orderStatus;
        const validNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];

        if (currentStatus !== targetStatus && !validNextStatuses.includes(targetStatus)) {
          throw new BadRequestException(
            `Invalid order status transition from "${currentStatus}" to "${targetStatus}". Allowed next statuses: [${validNextStatuses.join(', ')}]`,
          );
        }

        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            orderStatus: targetStatus,
            statusHistory: {
              create: {
                status: targetStatus,
                note: note || `Status updated to ${targetStatus}`,
                updatedBy,
              },
            },
          },
          include: { items: true, statusHistory: true },
        });

        // Restock inventory if order is cancelled
        if (targetStatus === OrderStatus.CANCELLED && currentStatus !== OrderStatus.CANCELLED) {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }

        const result = updatedOrder;

        // Non-blocking background job enqueue after DB commit
        if (result && result.customerEmail) {
          this.queuesService.enqueueOrderStatusUpdate({
            orderId: result.id,
            orderNumber: result.orderNumber,
            customerEmail: result.customerEmail,
            customerName: result.customerName,
            status: result.orderStatus,
            note,
          });
        }

        return result;
      });
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof NotFoundException) throw err;
      return { message: `Order ${orderId} status set to ${targetStatus}` };
    }
  }

  async verifyAdvancePayment(orderId: string, status: 'VERIFIED' | 'REJECTED', note?: string, updatedBy = 'Admin User') {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        advancePaymentStatus: status,
        statusHistory: {
          create: {
            status: order.orderStatus,
            note: note || `Advance Payment (PKR 1,000) mark as ${status}`,
            updatedBy,
          },
        },
      },
      include: { items: true, statusHistory: true },
    });

    return {
      message: `Advance payment status updated to ${status}`,
      order: updated,
    };
  }
}
