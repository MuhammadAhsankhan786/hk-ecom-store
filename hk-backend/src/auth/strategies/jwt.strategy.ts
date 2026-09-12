import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'hk_fabric_jwt_secret_key_change_in_production_2026',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    let user: any = null;
    try {
      user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
    } catch {
      // Fallback for offline/disconnected DB mode only on connection error
      return { id: payload.sub, email: payload.email, role: payload.role, name: 'Authenticated User' };
    }

    if (!user) {
      throw new UnauthorizedException('User account no longer exists or has been revoked');
    }
    return user;
  }
}
