import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    let connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/hk_fabric';
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    if (isLocal) {
      connectionString = connectionString.replace('?sslmode=require', '').replace('&sslmode=require', '');
    }
    const isSsl = !isLocal && (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech'));

    const pool = new Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : false,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('[PrismaService] Connected to PostgreSQL / Neon DB database.');
    } catch (err) {
      console.warn('[PrismaService] Database connection pending (credentials in .env required).', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
