import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Inventory Management')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER, UserRole.INVENTORY_MANAGER)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('adjust')
  @ApiOperation({ summary: 'Perform stock adjustment (Restock, Damage, Correction)' })
  adjustStock(@Body() dto: StockAdjustmentDto, @CurrentUser() user: any) {
    const performedBy = user?.name || user?.email || 'Admin User';
    return this.inventoryService.adjustStock(dto, performedBy);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get stock adjustment audit logs' })
  @ApiQuery({ name: 'productId', required: false })
  getLogs(@Query('productId') productId?: string) {
    return this.inventoryService.getLogs(productId);
  }

  @Get('low-stock-alerts')
  @ApiOperation({ summary: 'Get low stock alerts' })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  getLowStockAlerts(@Query('threshold') threshold?: string) {
    const t = threshold ? parseInt(threshold, 10) : 5;
    return this.inventoryService.getLowStockAlerts(t);
  }
}
