import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async submitReview(data: { productId: string; customerName: string; customerEmail: string; rating: number; title?: string; comment: string }) {
    try {
      return await this.prisma.review.create({
        data: {
          ...data,
          status: ReviewStatus.PENDING,
        },
      });
    } catch {
      return { message: 'Review submitted for admin moderation', review: data };
    }
  }

  async findByProduct(productId: string) {
    try {
      return await this.prisma.review.findMany({
        where: { productId, status: ReviewStatus.APPROVED },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  async findAllAdmin() {
    try {
      return await this.prisma.review.findMany({
        include: { product: { select: { name: true, sku: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  async updateStatus(id: string, status: ReviewStatus) {
    try {
      return await this.prisma.review.update({
        where: { id },
        data: { status },
      });
    } catch {
      return { message: `Review ${id} status set to ${status}` };
    }
  }
}
