import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { Counter } from 'k6/metrics';

// Environment variables
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const TARGET_PRODUCT_ID = __ENV.TARGET_PRODUCT_ID || 'prod-default';
const CONCURRENCY_PRODUCT_ID = __ENV.CONCURRENCY_PRODUCT_ID || 'prod-concurrency';
const TEST_STAGE = __ENV.TEST_STAGE || '100VU';
const LOAD_TEST_SECRET = __ENV.LOAD_TEST_SECRET || 'hk_fabric_k6_loadtest_secret_2026';
const ALLOW_PROD = __ENV.ALLOW_PRODUCTION_LOAD_TEST === 'true';

// SAFETY GUARD: Abort immediately if attempting to run load test against production without explicit flag
if ((BASE_URL.includes('vercel.app') || BASE_URL.includes('hkfabric.pk')) && !ALLOW_PROD) {
  fail(`[SAFETY ABORT] Target URL "${BASE_URL}" appears to be PRODUCTION! Load test terminated.`);
}

// Custom Categorized Metric Counters
const count2xx = new Counter('http_2xx_success');
const count429 = new Counter('http_429_throttled');
const count5xx = new Counter('http_5xx_server_error');

let targetVUs = 100;
if (TEST_STAGE === '500VU') targetVUs = 500;
if (TEST_STAGE === '1000VU') targetVUs = 1000;

export const options = TEST_STAGE === 'CONCURRENCY_ONLY' ? {
  scenarios: {
    same_product_concurrency: {
      executor: 'per-vu-iterations',
      vus: 50,
      iterations: 1,
      maxDuration: '15s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<1.0'],
  },
} : {
  stages: [
    { duration: '3s', target: targetVUs },
    { duration: '12s', target: targetVUs },
    { duration: '3s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
  },
};

function recordStatus(res) {
  if (res.status >= 200 && res.status < 400) count2xx.add(1);
  if (res.status === 429) count429.add(1);
  if (res.status >= 500) count5xx.add(1);
}

export default function () {
  const commonHeaders = {
    'x-load-test-secret': LOAD_TEST_SECRET,
  };

  if (TEST_STAGE === 'CONCURRENCY_ONLY') {
    // Scenario F: Same-Product Single-Unit Concurrency Audit
    const payload = JSON.stringify({
      customerName: `Concurrent Buyer ${__VU}`,
      customerEmail: `buyer${__VU}@hkfabric.pk`,
      customerPhone: '03001234567',
      shippingAddress: 'DHA Phase 5',
      city: 'Lahore',
      paymentMethod: 'PayFast',
      items: [
        {
          productId: CONCURRENCY_PRODUCT_ID,
          productName: 'Limited Edition Silk Sheet',
          productSku: 'SKU-LIMITED-001',
          variantSize: 'King',
          variantColor: 'Gold',
          unitPrice: 15000,
          quantity: 1,
        },
      ],
    });

    const params = {
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
        'x-idempotency-key': `k6-conc-${__VU}-${Date.now()}-${Math.random()}`,
      },
    };

    const res = http.post(`${BASE_URL}/orders`, payload, params);
    recordStatus(res);
    check(res, {
      'status is 201 or 409 or 400': (r) => r.status === 201 || r.status === 409 || r.status === 400,
    });
    return;
  }

  // Mixed Storefront Traffic Workflow (Scenarios A - E)
  const rand = Math.random();

  if (rand < 0.25) {
    // Scenario A: Health Check
    const res = http.get(`${BASE_URL}/health`, { headers: commonHeaders });
    recordStatus(res);
    check(res, { 'Health status 200': (r) => r.status === 200 });
  } else if (rand < 0.45) {
    // Scenario B: Category & Collection Navigation
    const catRes = http.get(`${BASE_URL}/categories`, { headers: commonHeaders });
    recordStatus(catRes);
    check(catRes, { 'Categories status 200': (r) => r.status === 200 });
  } else if (rand < 0.70) {
    // Scenario C: Search Engine
    const searchRes = http.get(`${BASE_URL}/products?search=cotton&page=1&limit=8`, { headers: commonHeaders });
    recordStatus(searchRes);
    check(searchRes, { 'Search status 200': (r) => r.status === 200 });
  } else if (rand < 0.90) {
    // Scenario D: Product Detail View
    const prodRes = http.get(`${BASE_URL}/products`, { headers: commonHeaders });
    recordStatus(prodRes);
    check(prodRes, { 'Products status 200': (r) => r.status === 200 });
  } else {
    // Scenario E: Checkout API Stress (Safe Synthetic Order Placement)
    const payload = JSON.stringify({
      customerName: `k6 VU ${__VU}`,
      customerEmail: `vu${__VU}_${Date.now()}@hkfabric.pk`,
      customerPhone: '03009998877',
      shippingAddress: 'Gulberg III',
      city: 'Lahore',
      paymentMethod: 'PayFast',
      items: [
        {
          productId: TARGET_PRODUCT_ID,
          productName: 'k6 Stress Test Linen',
          productSku: 'SKU-K6-STRESS',
          variantSize: 'Queen',
          variantColor: 'White',
          unitPrice: 5000,
          quantity: 1,
        },
      ],
    });

    const params = {
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
        'x-idempotency-key': `k6-stress-${__VU}-${Date.now()}-${Math.random()}`,
      },
    };

    const res = http.post(`${BASE_URL}/orders`, payload, params);
    recordStatus(res);
    check(res, { 'Checkout status 201 or 409': (r) => r.status === 201 || r.status === 409 });
  }

  sleep(0.1);
}
