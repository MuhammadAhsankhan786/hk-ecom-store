import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IdempotencyService } from '../services/idempotency.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const idempotencyKey = request.headers['x-idempotency-key'] || request.headers['idempotency-key'];

    if (!idempotencyKey) {
      return true; // Key optional or fallback
    }

    const cached = this.idempotencyService.get(String(idempotencyKey));
    if (cached) {
      console.log(`[IdempotencyGuard] Duplicate request intercepted for key "${idempotencyKey}". Returning cached response.`);
      response.status(cached.statusCode).json(cached.body);
      return false; // Stop controller execution and return cached response
    }

    // Attach key to request for interceptor caching
    request.idempotencyKey = idempotencyKey;
    return true;
  }
}
