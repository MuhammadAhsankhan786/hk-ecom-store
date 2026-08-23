import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class VariantDto {
  @ApiProperty({ example: 'SKU-BED-KING-NVY' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'King' })
  @IsString()
  size: string;

  @ApiProperty({ example: 'Navy Blue' })
  @IsString()
  color: string;

  @ApiProperty({ example: '#000080', required: false })
  @IsOptional()
  @IsString()
  colorHex?: string;

  @ApiProperty({ example: 4500, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  stock: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Royal Velvet Bridal Bedspread Set' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'royal-velvet-bridal-bedspread-set' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Premium 100% velvet embroidered comforter set with 4 pillow covers.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'SKU-VELVET-BRIDAL' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 8500 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 6999, required: false })
  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  collectionId?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ type: [VariantDto], required: false })
  @IsOptional()
  @IsArray()
  variants?: VariantDto[];
}
