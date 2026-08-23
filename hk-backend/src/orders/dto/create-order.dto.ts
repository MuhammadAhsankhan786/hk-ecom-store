import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'prod-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'Royal Velvet Bridal Bedspread Set' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 'SKU-VELVET-BRIDAL' })
  @IsString()
  @IsNotEmpty()
  productSku: string;

  @ApiProperty({ example: 'King' })
  @IsString()
  variantSize: string;

  @ApiProperty({ example: 'Deep Maroon' })
  @IsString()
  variantColor: string;

  @ApiProperty({ example: 6999 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Farhan Zaidi' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'farhan@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+92 321 9876543' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'House #45-B, Block 4, PECHS' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ example: 'Karachi' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Online Card / PayFast', description: 'PayFast | Easypaisa | JazzCash | Card' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ example: 'WELCOME10', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Please leave with gate security if not home', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
