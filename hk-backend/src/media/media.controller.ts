import { Controller, Get, Post, Query, Delete, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Media & Cloudinary')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload product image directly using Multer to Cloudinary CDN' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          example: 'products',
        },
      },
    },
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.mediaService.uploadImageWithMulter(file, folder || 'products');
  }

  @Get('signature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate signed Cloudinary upload credentials for Admin image upload' })
  @ApiQuery({ name: 'folder', required: false })
  getSignature(@Query('folder') folder?: string) {
    return this.mediaService.generateUploadSignature(folder || 'products');
  }

  @Delete(':cloudinaryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STORE_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Cloudinary asset by Public ID' })
  deleteImage(@Param('cloudinaryId') cloudinaryId: string) {
    return this.mediaService.deleteImage(cloudinaryId);
  }
}
