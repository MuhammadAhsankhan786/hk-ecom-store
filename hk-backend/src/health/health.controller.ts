import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'System operational health check (API, PostgreSQL DB, Redis, Queues)' })
  async checkHealth() {
    const services: Record<string, string> = {
      api: 'ok',
      database: 'unhealthy',
      redis: 'unavailable',
      queues: 'degraded',
    };

    // 1. PostgreSQL Database Check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      services.database = 'ok';
    } catch {
      services.database = 'unhealthy';
    }

    // 2. Redis Connection Check
    const redisHost = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const redisPort = this.configService.get<number>('REDIS_PORT') || 6379;
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    let client: Redis | null = null;
    try {
      client = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword || undefined,
        connectTimeout: 1000,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });

      await client.connect();
      const pingRes = await client.ping();

      if (pingRes === 'PONG') {
        services.redis = 'ok';
        services.queues = 'ok';
      }
    } catch {
      services.redis = 'unavailable';
      services.queues = 'degraded';
    } finally {
      if (client) {
        client.disconnect();
      }
    }

    const overallStatus =
      services.database === 'ok' && services.redis === 'ok'
        ? 'ok'
        : services.database === 'ok'
        ? 'degraded'
        : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
    };
  }
}
