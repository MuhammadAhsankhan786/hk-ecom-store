import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryStatus } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category Name', example: 'Bedsheets' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'URL Slug', example: 'bedsheets' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Category Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Category Header / Banner Image URL' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'Parent Category ID for nesting' })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ enum: CategoryStatus, default: CategoryStatus.PUBLISHED })
  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: CategoryStatus;
}
