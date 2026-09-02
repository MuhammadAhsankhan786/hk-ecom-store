import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Royal Bridal Collection' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'royal-bridal-collection' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Velvet & Satin Heavy Sets' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/demo/image/upload/v123/bridal.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
