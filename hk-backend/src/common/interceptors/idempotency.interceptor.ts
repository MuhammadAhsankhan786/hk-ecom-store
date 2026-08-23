import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdempotencyService } from '../services/idempotency.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const key = request.idempotencyKey;

    return next.handle().pipe(
      tap((data) => {
        if (key) {
          const statusCode = response.statusCode || 201;
          this.idempotencyService.set(key, data, statusCode);
          console.log(`[IdempotencyInterceptor] Cached successful response for key "${key}".`);
        }
      }),
    );
  }
}
