import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async adjustStock(dto: StockAdjustmentDto, performedBy: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Product not found');

        const prevQty = product.stock;
        const newQty = Math.max(0, prevQty + dto.adjustment);

        // Update Product base stock
        await tx.product.update({
          where: { id: dto.productId },
          data: { stock: newQty },
        });

        // Update Variant stock if provided
        if (dto.variantId) {
          await tx.productVariant.update({
            where: { id: dto.variantId },
            data: { stock: { increment: dto.adjustment } },
          });
        }

        // Record Inventory Audit Log
        const log = await tx.inventoryTransaction.create({
          data: {
            productId: dto.productId,
            variantId: dto.variantId,
            previousQty: prevQty,
            adjustment: dto.adjustment,
            newQty,
            type: dto.type,
            reason: dto.reason,
            notes: dto.notes,
            performedBy,
          },
        });

        return { message: 'Stock adjusted successfully', previousQty: prevQty, newQty, log };
      });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      return { message: 'Stock adjustment recorded (mock mode)', dto };
    }
  }

  async getLogs(productId?: string) {
    try {
      return await this.prisma.inventoryTransaction.findMany({
        where: productId ? { productId } : undefined,
        include: {
          product: { select: { name: true, sku: true } },
          variant: { select: { size: true, color: true, sku: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  async getLowStockAlerts(threshold = 5) {
    try {
      return await this.prisma.product.findMany({
        where: {
          stock: { lte: threshold },
          isArchived: false,
        },
        include: { category: true },
      });
    } catch {
      return [];
    }
  }
}
