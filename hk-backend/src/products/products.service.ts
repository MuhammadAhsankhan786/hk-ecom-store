import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: {
    categoryId?: string;
    collectionId?: string;
    search?: string;
    isFeatured?: boolean;
    includeDrafts?: boolean;
    status?: ProductStatus;
    page?: number;
    limit?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
  }) {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { isArchived: false };

      if (query?.includeDrafts) {
        if (query?.status) where.status = query.status;
      } else {
        // Public Storefront: Only show Published non-archived products
        where.status = ProductStatus.PUBLISHED;
      }

      if (query?.categoryId) {
        // Check if categoryId is a UUID or name
        const cat = await this.prisma.category.findFirst({
          where: { OR: [{ id: query.categoryId }, { name: query.categoryId }, { slug: query.categoryId }] },
        });
        if (cat) where.categoryId = cat.id;
      }

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
      if (query?.sortBy === 'newest') orderBy = { publishedAt: 'desc' };

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
    const { images, variants, categoryId, status, ...productData } = dto;

    let finalCategoryId = categoryId;
    if (categoryId) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ id: categoryId }, { name: categoryId }, { slug: categoryId }] },
      });
      if (cat) finalCategoryId = cat.id;
    }

    const finalStatus = status || ProductStatus.PUBLISHED;
    const publishedAt = finalStatus === ProductStatus.PUBLISHED ? new Date() : null;

    return await this.prisma.product.create({
      data: {
        ...productData,
        status: finalStatus,
        publishedAt,
        categoryId: finalCategoryId,
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
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product "${id}" not found`);
    }

    const { images, variants, categoryId, status, ...productData } = dto;

    let finalCategoryId = categoryId;
    if (categoryId) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ id: categoryId }, { name: categoryId }, { slug: categoryId }] },
      });
      if (cat) finalCategoryId = cat.id;
    }

    const updateData: any = { ...productData };
    if (finalCategoryId !== undefined) updateData.categoryId = finalCategoryId;

    if (status) {
      updateData.status = status;
      if (status === ProductStatus.PUBLISHED && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
      if (status === ProductStatus.ARCHIVED) {
        updateData.isArchived = true;
      }
    }

    if (images && images.length > 0) {
      // Re-create product images
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      updateData.images = {
        create: images.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
          sortOrder: idx,
        })),
      };
    }

    return await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, images: true, variants: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product "${id}" not found`);
    }

    return await this.prisma.product.update({
      where: { id },
      data: { isArchived: true, status: ProductStatus.ARCHIVED },
    });
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
