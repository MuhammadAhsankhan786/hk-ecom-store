import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryStatus } from '@prisma/client';

@Injectable()
export class CategoriesService {
  private cacheMap = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 15000;

  constructor(private prisma: PrismaService) {}

  private clearCache() {
    this.cacheMap.clear();
  }

  async findAll(includeInactive = false) {
    const cacheKey = `categories:${includeInactive}`;
    const now = Date.now();
    const cached = this.cacheMap.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const where: any = {};
    if (!includeInactive) {
      where.status = CategoryStatus.PUBLISHED;
    }

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    this.cacheMap.set(cacheKey, { data: categories, expiresAt: now + this.CACHE_TTL_MS });
    return categories;
  }

  async findOne(idOrSlug: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        children: true,
        products: {
          where: { isArchived: false, status: 'PUBLISHED' },
          include: { images: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category "${idOrSlug}" not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });

    if (existing) {
      throw new ConflictException(`Category with name "${dto.name}" or slug "${slug}" already exists`);
    }

    const publishedAt = dto.status === CategoryStatus.PUBLISHED ? new Date() : null;

    const result = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        image: dto.image,
        parentId: dto.parentId,
        status: dto.status || CategoryStatus.PUBLISHED,
        publishedAt,
      },
    });

    this.clearCache();
    return result;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category "${id}" not found`);
    }

    const data: any = { ...dto };

    if (dto.name && !dto.slug) {
      data.slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (dto.status === CategoryStatus.PUBLISHED && !category.publishedAt) {
      data.publishedAt = new Date();
    }

    const result = await this.prisma.category.update({
      where: { id },
      data,
    });

    this.clearCache();
    return result;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category "${id}" not found`);
    }

    const result = await this.prisma.category.update({
      where: { id },
      data: { status: CategoryStatus.ARCHIVED },
    });

    this.clearCache();
    return result;
  }
}
