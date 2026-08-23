import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewStatus, UserRole } from '@prisma/client';

@ApiTags('Product Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit customer product review' })
  submitReview(@Body() data: any) {
    return this.reviewsService.submitReview(data);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get approved reviews for product' })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews for moderation (Admin)' })
  findAllAdmin() {
    return this.reviewsService.findAllAdmin();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve / Reject review (Admin)' })
  updateStatus(@Param('id') id: string, @Body('status') status: ReviewStatus) {
    return this.reviewsService.updateStatus(id, status);
  }
}
