import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  private cacheMap = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 15000;

  constructor(private prisma: PrismaService) {}

  clearCache() {
    this.cacheMap.clear();
  }

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

      const isPublicQuery = !query?.includeDrafts;
      const cacheKey = JSON.stringify(query || {});
      const now = Date.now();

      if (isPublicQuery) {
        const cached = this.cacheMap.get(cacheKey);
        if (cached && cached.expiresAt > now) {
          return cached.data;
        }
      }

      const where: any = { isArchived: false };

      if (query?.includeDrafts) {
        if (query?.status) where.status = query.status;
      } else {
        where.status = ProductStatus.PUBLISHED;
      }

      if (query?.categoryId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query.categoryId);
        if (isUuid) {
          where.categoryId = query.categoryId;
        } else {
          const cat = await this.prisma.category.findFirst({
            where: { OR: [{ id: query.categoryId }, { name: query.categoryId }, { slug: query.categoryId }] },
          });
          if (cat) where.categoryId = cat.id;
        }
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
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            sku: true,
            price: true,
            salePrice: true,
            stock: true,
            isFeatured: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            categoryId: true,
            collectionId: true,
            category: { select: { id: true, name: true, slug: true } },
            collection: { select: { id: true, name: true, slug: true } },
            images: { select: { id: true, url: true, isPrimary: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } },
            variants: { select: { id: true, sku: true, size: true, color: true, price: true, stock: true } },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const result = {
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

      if (isPublicQuery) {
        this.cacheMap.set(cacheKey, { data: result, expiresAt: now + this.CACHE_TTL_MS });
      }

      return result;
    } catch (err: any) {
      console.warn('[ProductsService.findAll Error]', err?.message || err);
      return { data: [], pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
    }
  }

  async findOne(idOrSlug: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          sku: true,
          price: true,
          salePrice: true,
          stock: true,
          isFeatured: true,
          isArchived: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          collectionId: true,
          category: { select: { id: true, name: true, slug: true, description: true, image: true, status: true } },
          collection: { select: { id: true, name: true, slug: true, description: true, image: true, isFeatured: true } },
          images: { select: { id: true, productId: true, url: true, isPrimary: true, sortOrder: true, altText: true }, orderBy: { sortOrder: 'asc' } },
          variants: { select: { id: true, productId: true, sku: true, size: true, color: true, colorHex: true, price: true, stock: true } },
          reviews: { where: { status: 'APPROVED' }, select: { id: true, productId: true, customerName: true, rating: true, title: true, comment: true, createdAt: true } },
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
      const { images, variants, categoryId, collectionId, status } = dto;

      let finalCategoryId: string | null = null;
      if (categoryId && categoryId.trim() !== '') {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
        if (isUuid) {
          finalCategoryId = categoryId;
        } else {
          const cat = await this.prisma.category.findFirst({
            where: { OR: [{ id: categoryId }, { name: categoryId }, { slug: categoryId }] },
          });
          if (cat) finalCategoryId = cat.id;
        }
      }

      let finalCollectionId: string | null = null;
      if (collectionId && collectionId.trim() !== '') {
        const col = await this.prisma.collection.findFirst({
          where: { OR: [{ id: collectionId }, { name: collectionId }, { slug: collectionId }] },
        });
        if (col) finalCollectionId = col.id;
      }

      let finalStatus: ProductStatus = ProductStatus.PUBLISHED;
      if ((status as any) === 'Active' || status === ProductStatus.PUBLISHED) {
        finalStatus = ProductStatus.PUBLISHED;
      } else if ((status as any) === 'Draft' || status === ProductStatus.DRAFT) {
        finalStatus = ProductStatus.DRAFT;
      } else if ((status as any) === 'Archived' || status === ProductStatus.ARCHIVED) {
        finalStatus = ProductStatus.ARCHIVED;
      } else if (status) {
        finalStatus = status;
      }

      const publishedAt = finalStatus === ProductStatus.PUBLISHED ? new Date() : null;

      let rawSlug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!rawSlug || rawSlug.trim() === '') {
        rawSlug = (dto.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      let slug = rawSlug;
      const existingSlug = await this.prisma.product.findUnique({ where: { slug } });
      if (existingSlug) {
        slug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
      }

      let rawSku = dto.sku || `HK-${slug.substring(0, 5).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      let sku = rawSku;
      const existingSku = await this.prisma.product.findUnique({ where: { sku } });
      if (existingSku) {
        sku = `${rawSku}-${Math.floor(Math.random() * 1000)}`;
      }

      const validImages = Array.isArray(images)
        ? images.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
        : [];

      const description = dto.description || (dto as any).shortDescription || 'No description provided.';
      const price = Number(dto.price || 0);
      const salePrice = dto.salePrice ? Number(dto.salePrice) : null;
      const stock = Number(dto.stock || 0);
      const isFeatured = Boolean(dto.isFeatured);

      const created = await this.prisma.product.create({
        data: {
          name: dto.name,
          slug,
          description,
          sku,
          price,
          salePrice,
          stock,
          isFeatured,
          status: finalStatus,
          publishedAt,
          categoryId: finalCategoryId,
          collectionId: finalCollectionId,
          images: validImages.length > 0
            ? {
                create: validImages.map((url, idx) => ({
                  url,
                  isPrimary: idx === 0,
                  sortOrder: idx,
                })),
              }
            : undefined,
          variants: variants && variants.length > 0
            ? {
                create: variants,
              }
            : undefined,
        },
        include: {
          category: true,
          collection: true,
          images: true,
          variants: true,
        },
      });

      this.clearCache();
      return created;
    } catch (err: any) {
      if (err.code === 'P2002') {
        const target = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target) : 'field';
        throw new BadRequestException(`A product with this ${target} already exists.`);
      }
      console.error('Error creating product in DB:', err);
      throw new BadRequestException(err.message || 'Failed to create product in database.');
    }
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    try {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Product "${id}" not found`);
      }

      const { images, variants, categoryId, collectionId, status, ...rest } = dto as any;

      let finalCategoryId: string | null | undefined = undefined;
      if (categoryId !== undefined) {
        if (categoryId && categoryId.trim() !== '') {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
          if (isUuid) {
            finalCategoryId = categoryId;
          } else {
            const cat = await this.prisma.category.findFirst({
              where: { OR: [{ id: categoryId }, { name: categoryId }, { slug: categoryId }] },
            });
            finalCategoryId = cat ? cat.id : null;
          }
        } else {
          finalCategoryId = null;
        }
      }

      let finalCollectionId: string | null | undefined = undefined;
      if (collectionId !== undefined) {
        if (collectionId && collectionId.trim() !== '') {
          const col = await this.prisma.collection.findFirst({
            where: { OR: [{ id: collectionId }, { name: collectionId }, { slug: collectionId }] },
          });
          finalCollectionId = col ? col.id : null;
        } else {
          finalCollectionId = null;
        }
      }

      const updateData: any = {};
      if (rest.name !== undefined) updateData.name = rest.name;
      if (rest.slug !== undefined) updateData.slug = rest.slug;
      if (rest.description !== undefined) updateData.description = rest.description || 'No description provided.';
      if (rest.sku !== undefined) updateData.sku = rest.sku;
      if (rest.price !== undefined) updateData.price = Number(rest.price);
      if (rest.salePrice !== undefined) updateData.salePrice = rest.salePrice ? Number(rest.salePrice) : null;
      if (rest.stock !== undefined) updateData.stock = Number(rest.stock);
      if (rest.isFeatured !== undefined) updateData.isFeatured = Boolean(rest.isFeatured);
      if (finalCategoryId !== undefined) updateData.categoryId = finalCategoryId;
      if (finalCollectionId !== undefined) updateData.collectionId = finalCollectionId;

      if (status) {
        let finalStatus: ProductStatus = ProductStatus.DRAFT;
        if (status === 'Active' || status === ProductStatus.PUBLISHED) {
          finalStatus = ProductStatus.PUBLISHED;
        } else if (status === 'Archived' || status === ProductStatus.ARCHIVED) {
          finalStatus = ProductStatus.ARCHIVED;
        } else {
          finalStatus = status;
        }

        updateData.status = finalStatus;
        if (finalStatus === ProductStatus.PUBLISHED && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
        if (finalStatus === ProductStatus.ARCHIVED) {
          updateData.isArchived = true;
        }
      }

      if (images) {
        const validImages = Array.isArray(images)
          ? images.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
          : [];
        await this.prisma.productImage.deleteMany({ where: { productId: id } });
        updateData.images = {
          create: validImages.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        };
      }

      const updated = await this.prisma.product.update({
        where: { id },
        data: updateData,
        include: { category: true, collection: true, images: true, variants: true },
      });

      this.clearCache();
      return updated;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      if (err.code === 'P2002') {
        const target = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target) : 'field';
        throw new BadRequestException(`Product update failed: duplicate ${target}.`);
      }
      console.error('Error updating product in DB:', err);
      throw new BadRequestException(err.message || 'Failed to update product.');
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product "${id}" not found`);
    }

    const removed = await this.prisma.product.update({
      where: { id },
      data: { isArchived: true, status: ProductStatus.ARCHIVED },
    });

    this.clearCache();
    return removed;
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
