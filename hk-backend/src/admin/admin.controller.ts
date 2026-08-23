import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin Operations & CMS')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard-metrics')
  @ApiOperation({ summary: 'Get overview dashboard metrics (Revenue, Orders, Low stock)' })
  getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get store audit logs' })
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }

  @Get('cms')
  @ApiOperation({ summary: 'Get Homepage CMS configuration' })
  getCMSContent() {
    return this.adminService.getCMSContent();
  }

  @Post('cms')
  @ApiOperation({ summary: 'Update Homepage CMS banners & announcement bar' })
  updateCMSContent(@Body() data: any) {
    return this.adminService.updateCMSContent(data);
  }
}
