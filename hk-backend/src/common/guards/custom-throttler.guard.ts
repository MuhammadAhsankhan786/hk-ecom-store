import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import * as crypto from 'crypto';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context } = requestProps;
    const req = context.switchToHttp().getRequest();
    const isProd = process.env.NODE_ENV === 'production';
    const isLoadTestEnabled = process.env.LOAD_TESTING_ENABLED === 'true';
    const secretHeader = req.headers['x-load-test-secret'];
    const expectedSecret = process.env.LOAD_TEST_SECRET;

    // Secure load-testing bypass criteria:
    // 1. Environment must NOT be production
    // 2. LOAD_TESTING_ENABLED must be explicitly set to 'true'
    // 3. x-load-test-secret header must be present and match LOAD_TEST_SECRET (timing-safe check)
    if (!isProd && isLoadTestEnabled && secretHeader && expectedSecret) {
      try {
        const bufHeader = Buffer.from(String(secretHeader));
        const bufExpected = Buffer.from(String(expectedSecret));
        if (
          bufHeader.length === bufExpected.length &&
          crypto.timingSafeEqual(bufHeader, bufExpected)
        ) {
          // Elevated limit for authorized load-testing VUs (100,000 requests per minute)
          return super.handleRequest({
            ...requestProps,
            limit: 100000,
          });
        }
      } catch {
        // Fall back to normal rate limiting on error
      }
    }

    // Default rate limit for all standard public traffic (120 reqs/min per IP)
    return super.handleRequest(requestProps);
  }
}
