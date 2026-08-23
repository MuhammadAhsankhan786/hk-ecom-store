import { Global, Module } from '@nestjs/common';
import { IdempotencyService } from './services/idempotency.service';
import { IdempotencyGuard } from './guards/idempotency.guard';
import { IdempotencyInterceptor } from './interceptors/idempotency.interceptor';
import { CatalogCacheService } from './services/cache.service';

@Global()
@Module({
  providers: [IdempotencyService, IdempotencyGuard, IdempotencyInterceptor, CatalogCacheService],
  exports: [IdempotencyService, IdempotencyGuard, IdempotencyInterceptor, CatalogCacheService],
})
export class CommonModule {}
