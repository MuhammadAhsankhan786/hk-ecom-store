import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail({}, { message: 'Please enter a valid email address (e.g. name@domain.com)' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Muhammad Ali' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  name: string;

  @ApiProperty({ example: '03001234567', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(\+92|03)\d{9}$/, { message: 'Phone number must be a valid 11-digit Pakistani mobile number (e.g. 03001234567)' })
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@hkfabric.pk' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
