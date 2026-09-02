import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Collections Management')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all featured collections' })
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get single collection by ID or Slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.collectionsService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new collection (Admin)' })
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update collection details & image (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete collection (Admin)' })
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
