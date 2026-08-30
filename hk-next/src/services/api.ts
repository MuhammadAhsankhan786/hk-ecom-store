/**
 * HK Fabric Storefront API Client
 * Connects hk-next directly to NestJS REST Backend (http://localhost:5000)
 */

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl;
      }
      return 'https://hk-backend-bice.vercel.app';
    }
  }
  if (process.env.NODE_ENV === 'production') {
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
    return 'https://hk-backend-bice.vercel.app';
  }
  return envUrl || 'http://localhost:5000';
}

export async function fetchProductsFromAPI(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  try {
    const url = new URL(`${getApiBaseUrl()}/products`);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.page) url.searchParams.append('page', String(params.page));
    if (params?.limit) url.searchParams.append('limit', String(params.limit));
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
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createOrderAPI(orderData: any) {
  const res = await fetch(`${getApiBaseUrl()}/orders`, {
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
