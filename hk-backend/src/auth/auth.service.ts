import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerCustomer(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
      if (existing) {
        throw new ConflictException('Email address is already registered');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          name: dto.name,
          phone: dto.phone,
          role: UserRole.CUSTOMER,
          customerProfile: {
            create: {},
          },
        },
      });

      const token = this.generateToken(user.id, user.email, user.role);
      return {
        message: 'Account created successfully',
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken: token,
      };
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException('Unable to register user account at this time. Please try again later.');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.generateToken(user.id, user.email, user.role);
      return {
        message: 'Logged in successfully',
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken: token,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('Authentication service encountered an error. Please try again later.');
    }
  }

  private generateToken(userId: string, email: string, role: UserRole) {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}
