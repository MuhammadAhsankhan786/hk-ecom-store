import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdjustmentType } from '@prisma/client';

export class StockAdjustmentDto {
  @ApiProperty({ example: 'prod-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'variant-uuid-456', required: false })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ example: 10, description: 'Positive to add stock, negative to deduct' })
  @IsInt()
  adjustment: number;

  @ApiProperty({ enum: AdjustmentType, example: AdjustmentType.RESTOCK })
  @IsEnum(AdjustmentType)
  type: AdjustmentType;

  @ApiProperty({ example: 'Supplier Shipment Received' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: 'PO-98741 received at Lahore warehouse', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
