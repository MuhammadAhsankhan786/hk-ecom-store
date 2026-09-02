import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

const DEFAULT_COLLECTIONS = [
  {
    name: 'Royal Bridal Collection',
    slug: 'royal-bridal-collection',
    description: 'Velvet & Satin Heavy Sets with gold zari embroidery',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=100&auto=format',
    isFeatured: true,
  },
  {
    name: 'Summer Cotton Collection',
    slug: 'summer-cotton-collection',
    description: 'Light & breathable 100% Egyptian cotton sheets',
    image: 'https://images.unsplash.com/photo-1606796913825-2b02883605e9?w=1200&h=800&fit=crop&q=100&auto=format',
    isFeatured: true,
  },
  {
    name: 'Winter Mink Collection',
    slug: 'winter-mink-collection',
    description: 'Warm & cozy double-ply Korean mink plush blankets',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=1200&h=800&fit=crop&q=100&auto=format',
    isFeatured: true,
  },
];

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    let collections = await this.prisma.collection.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Seed defaults if table is empty
    if (collections.length === 0) {
      for (const item of DEFAULT_COLLECTIONS) {
        await this.prisma.collection.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }
      collections = await this.prisma.collection.findMany({
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    return collections;
  }

  async findOne(idOrSlug: string) {
    const collection = await this.prisma.collection.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        products: {
          include: { images: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!collection) {
      throw new NotFoundException(`Collection "${idOrSlug}" not found`);
    }

    return collection;
  }

  async create(dto: CreateCollectionDto) {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await this.prisma.collection.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });

    if (existing) {
      throw new ConflictException(`Collection with name or slug "${dto.name}" already exists.`);
    }

    return this.prisma.collection.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || '',
        image: dto.image || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=100&auto=format',
        isFeatured: dto.isFeatured ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);

    const data: Record<string, any> = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
      data.slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.image !== undefined) data.image = dto.image;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;

    return this.prisma.collection.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.collection.delete({
      where: { id },
    });
  }
}
