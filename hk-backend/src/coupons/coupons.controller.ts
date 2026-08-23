import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Coupons & Discounts')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate coupon code and compute discount amount' })
  validateCoupon(@Body('code') code: string, @Body('subtotal') subtotal: number) {
    return this.couponsService.validateCoupon(code, subtotal || 0);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all store coupons (Admin)' })
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new promo coupon (Admin)' })
  create(@Body() data: any) {
    return this.couponsService.create(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promo coupon (Admin)' })
  delete(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }
}
