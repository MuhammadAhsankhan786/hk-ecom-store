/**
 * HK Fabric Storefront API Client
 * Connects hk-next directly to NestJS REST Backend (http://localhost:5000)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchProductsFromAPI(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  // Prevent firing request to localhost:5000 if app is running on live production Vercel domain without NEXT_PUBLIC_API_URL configured
  if (typeof window !== 'undefined') {
    const isLiveDomain = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLiveDomain && (API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1'))) {
      return null;
    }
  }

  try {
    const url = new URL(`${API_BASE}/products`);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.page) url.searchParams.append('page', String(params.page));
    if (params?.limit) url.searchParams.append('limit', String(params.limit));
    // Cache buster: append current timestamp so browser never returns stale cached response
    url.searchParams.append('_t', Date.now().toString());

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchCategoriesFromAPI() {
  if (typeof window !== 'undefined') {
    const isLiveDomain = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLiveDomain && (API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1'))) {
      return null;
    }
  }

  try {
    const res = await fetch(`${API_BASE}/products/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createOrderAPI(orderData: any) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-idempotency-key': `chk-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Checkout failed with status ${res.status}`);
  }

  return await res.json();
}
