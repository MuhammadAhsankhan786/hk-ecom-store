import { Injectable } from '@nestjs/common';

interface IdempotentRecord {
  statusCode: number;
  body: any;
  createdAt: number;
}

@Injectable()
export class IdempotencyService {
  private cache = new Map<string, IdempotentRecord>();
  private readonly ttlMs = 10 * 60 * 1000; // 10 minutes cache window

  get(key: string): IdempotentRecord | null {
    const record = this.cache.get(key);
    if (!record) return null;

    if (Date.now() - record.createdAt > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return record;
  }

  set(key: string, body: any, statusCode = 201): void {
    this.cache.set(key, {
      statusCode,
      body,
      createdAt: Date.now(),
    });
  }
}
