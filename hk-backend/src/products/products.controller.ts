import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Products & Catalog')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active products with server-side pagination & filters' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'collectionId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDrafts', required: false, type: Boolean })
  @ApiQuery({ name: 'status', required: false, enum: UserRole })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['price_asc', 'price_desc', 'newest', 'popularity'] })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('category') category?: string,
    @Query('collectionId') collectionId?: string,
    @Query('search') search?: string,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('includeDrafts') includeDrafts?: string,
    @Query('status') status?: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popularity',
  ) {
    const targetCat = categoryId || category;
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 20;
    const incDrafts = includeDrafts === 'true';
    return this.productsService.findAll({ categoryId: targetCat, collectionId, search, isFeatured, includeDrafts: incDrafts, status, page: p, limit: l, sortBy });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get category tree hierarchy' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('collections')
  @ApiOperation({ summary: 'Get store collections' })
  getCollections() {
    return this.productsService.getCollections();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get single product details by ID or Slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Admin)' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product details (Admin)' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive product (Admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
