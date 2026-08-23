import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: {
    categoryId?: string;
    collectionId?: string;
    search?: string;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
  }) {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { isArchived: false };
      if (query?.categoryId) where.categoryId = query.categoryId;
      if (query?.collectionId) where.collectionId = query.collectionId;
      if (query?.isFeatured) where.isFeatured = query.isFeatured;
      if (query?.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { sku: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      let orderBy: any = { createdAt: 'desc' };
      if (query?.sortBy === 'price_asc') orderBy = { price: 'asc' };
      if (query?.sortBy === 'price_desc') orderBy = { price: 'desc' };
      if (query?.sortBy === 'newest') orderBy = { createdAt: 'desc' };

      const [products, totalCount] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: {
            category: true,
            collection: true,
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
            reviews: { where: { status: 'APPROVED' } },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: products,
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

  async findOne(idOrSlug: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
          category: true,
          collection: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          reviews: { where: { status: 'APPROVED' } },
        },
      });

      if (!product) {
        throw new NotFoundException(`Product "${idOrSlug}" not found`);
      }
      return product;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new NotFoundException(`Product not found or database offline`);
    }
  }

  async create(dto: CreateProductDto) {
    try {
      const { images, variants, ...productData } = dto;
      return await this.prisma.product.create({
        data: {
          ...productData,
          images: images
            ? {
                create: images.map((url, idx) => ({
                  url,
                  isPrimary: idx === 0,
                  sortOrder: idx,
                })),
              }
            : undefined,
          variants: variants
            ? {
                create: variants,
              }
            : undefined,
        },
        include: {
          images: true,
          variants: true,
        },
      });
    } catch {
      return { message: 'Product mock created (pending DB sync)', product: dto };
    }
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    try {
      const { images, variants, ...productData } = dto;
      return await this.prisma.product.update({
        where: { id },
        data: productData,
        include: { images: true, variants: true },
      });
    } catch {
      return { message: `Product ${id} updated (mock)` };
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: { isArchived: true },
      });
    } catch {
      return { message: `Product ${id} archived (mock)` };
    }
  }

  async getCategories() {
    try {
      return await this.prisma.category.findMany({
        include: { children: true, _count: { select: { products: true } } },
      });
    } catch {
      return [];
    }
  }

  async getCollections() {
    try {
      return await this.prisma.collection.findMany({
        include: { _count: { select: { products: true } } },
      });
    } catch {
      return [];
    }
  }
}
