import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const DEFAULT_DB_URL = 'postgresql://neondb_owner:npg_OuRQen1mU3dB@ep-muddy-lake-ay1a64tt-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
    let connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    if (isLocal) {
      connectionString = connectionString.replace('?sslmode=require', '').replace('&sslmode=require', '');
    }
    const isSsl = !isLocal && (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech'));

    // Configurable PostgreSQL Pool Size (Experiment: 25 connections, 3000ms timeout)
    const maxConnections = process.env.DATABASE_POOL_MAX ? parseInt(process.env.DATABASE_POOL_MAX, 10) : 25;
    const connectionTimeout = process.env.DATABASE_CONNECT_TIMEOUT ? parseInt(process.env.DATABASE_CONNECT_TIMEOUT, 10) : 3000;

    const pool = new Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : false,
      max: maxConnections,
      connectionTimeoutMillis: connectionTimeout,
      idleTimeoutMillis: 30000,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
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
