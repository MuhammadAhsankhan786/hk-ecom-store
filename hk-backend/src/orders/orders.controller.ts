import { Controller, Post, Body, Get, Param, Query, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrderStatus, UserRole } from '@prisma/client';
import { IdempotencyGuard } from '../common/guards/idempotency.guard';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@ApiTags('Orders Management')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(IdempotencyGuard)
  @UseInterceptors(IdempotencyInterceptor)
  @ApiOperation({ summary: 'Create new customer order (Checkout with Idempotency Protection)' })
  @ApiHeader({ name: 'x-idempotency-key', required: false, description: 'Unique UUID key to prevent duplicate orders on retry' })
  createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user?: any) {
    return this.ordersService.createOrder(dto, user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all store orders with pagination (Admin)' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 20;
    return this.ordersService.findAll({ status, search, page: p, limit: l });
  }

  @Get(':idOrNumber')
  @ApiOperation({ summary: 'Get order details by ID or Order Number' })
  findOne(@Param('idOrNumber') idOrNumber: string) {
    return this.ordersService.findOne(idOrNumber);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status with State Machine transition validation (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('note') note?: string,
    @CurrentUser() user?: any,
  ) {
    const updatedBy = user?.name || user?.email || 'Admin User';
    return this.ordersService.updateStatus(id, status, note, updatedBy);
  }
}
