/**
 * HK Fabric Storefront API Client
 * Connects hk-next directly to NestJS REST Backend (http://localhost:5000)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchProductsFromAPI(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  try {
    const url = new URL(`${API_BASE}/products`);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.page) url.searchParams.append('page', String(params.page));
    if (params?.limit) url.searchParams.append('limit', String(params.limit));

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline or unreachable, falling back to cached catalog state:', err);
    return null;
  }
}

export async function fetchCategoriesFromAPI() {
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
