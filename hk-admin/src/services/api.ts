/**
 * HK Fabric Admin Panel — Full API Client
 * Connects hk-admin to NestJS REST Backend (http://localhost:5000)
 * All product/category mutations go through the real backend API.
 */
import { toast } from 'react-hot-toast';

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return envUrl || 'http://localhost:5000';
    }
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
    return 'https://hk-backend-bice.vercel.app';
  }
  return envUrl || 'http://localhost:5000';
}

function getStorefrontUrl(): string {
  const envUrl = import.meta.env.VITE_STOREFRONT_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl;
      }
      return 'https://hk-ecom-store.vercel.app';
    }
  }
  return envUrl || 'http://localhost:3000';
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('hk_admin_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      errorMessage = errBody?.message || errBody?.error || errorMessage;
    } catch {
      // ignore JSON parse errors on error body
    }
    
    if (res.status === 401) {
      errorMessage = "Unauthorized access. Please login again.";
      localStorage.removeItem('hk_admin_token');
      localStorage.setItem('hk_admin_auth', 'false');
      setTimeout(() => window.location.reload(), 1500);
    }
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function loginAdminAPI(email: string, password: string) {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.message || `Login failed with status ${res.status}`);
  }

  const data = await res.json();
  if (data.accessToken) {
    localStorage.setItem('hk_admin_token', data.accessToken);
    localStorage.setItem('hk_admin_auth', 'true');
  }
  return data;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export async function fetchAdminDashboardStats() {
  try {
    return await apiRequest('/admin/dashboard-metrics');
  } catch {
    return null;
  }
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function fetchAdminProductsAPI() {
  try {
    return await apiRequest('/products?includeDrafts=true');
  } catch {
    return null;
  }
}

export async function createProductAPI(payload: Record<string, any>) {
  return apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProductAPI(id: string, payload: Record<string, any>) {
  return apiRequest(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteProductAPI(id: string) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function fetchCategoriesAPI() {
  try {
    return await apiRequest('/categories?includeInactive=true');
  } catch {
    return null;
  }
}

export async function createCategoryAPI(payload: Record<string, any>) {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCategoryAPI(id: string, payload: Record<string, any>) {
  return apiRequest(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteCategoryAPI(id: string) {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────

export async function fetchCollectionsAPI() {
  try {
    return await apiRequest('/collections');
  } catch {
    return null;
  }
}

export async function createCollectionAPI(payload: Record<string, any>) {
  return apiRequest('/collections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCollectionAPI(id: string, payload: Record<string, any>) {
  return apiRequest(`/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteCollectionAPI(id: string) {
  return apiRequest(`/collections/${id}`, {
    method: 'DELETE',
  });
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function fetchAdminOrdersAPI() {
  try {
    const res = await apiRequest('/orders');
    return res?.data || res;
  } catch {
    return null;
  }
}

export async function updateOrderStatusAPI(id: string, status: string, note?: string) {
  return apiRequest(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

// ─── INVENTORY ───────────────────────────────────────────────────────────────

export async function adjustStockAPI(payload: {
  productId: string;
  variantId?: string;
  adjustment: number;
  type: string;
  reason: string;
  notes?: string;
}) {
  return apiRequest('/inventory/adjust', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchInventoryLogsAPI(productId?: string) {
  try {
    const path = productId ? `/inventory/logs?productId=${encodeURIComponent(productId)}` : '/inventory/logs';
    return await apiRequest(path);
  } catch {
    return null;
  }
}

// ─── COUPONS ─────────────────────────────────────────────────────────────────

export async function fetchCouponsAPI() {
  try {
    return await apiRequest('/coupons');
  } catch {
    return null;
  }
}

export async function createCouponAPI(payload: Record<string, any>) {
  return apiRequest('/coupons', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteCouponAPI(id: string) {
  return apiRequest(`/coupons/${id}`, {
    method: 'DELETE',
  });
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export async function fetchReviewsAdminAPI() {
  try {
    return await apiRequest('/reviews/admin');
  } catch {
    return null;
  }
}

export async function updateReviewStatusAPI(id: string, status: string) {
  return apiRequest(`/reviews/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── AUDIT LOGS & CMS ────────────────────────────────────────────────────────

export async function fetchAuditLogsAPI() {
  try {
    return await apiRequest('/admin/audit-logs');
  } catch {
    return null;
  }
}

export async function fetchCMSAPI() {
  try {
    return await apiRequest('/admin/cms');
  } catch {
    return null;
  }
}

export async function updateCMSAPI(payload: Record<string, any>) {
  return apiRequest('/admin/cms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── MEDIA UPLOAD (Cloudinary via Backend) ───────────────────────────────────

export async function uploadMediaToCloudinaryAPI(file: File, folder = 'products') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const token = localStorage.getItem('hk_admin_token');
  const res = await fetch(`${getApiBaseUrl()}/media/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Media upload failed with status ${res.status}`;
    try {
      const errBody = await res.json();
      errorMessage = errBody?.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
}

// ─── REVALIDATE STOREFRONT CACHE ─────────────────────────────────────────────

export async function revalidateStorefront(tag: string) {
  try {
    const secret = import.meta.env.VITE_REVALIDATION_SECRET;
    if (!secret) return;
    await fetch(`${getStorefrontUrl()}/api/revalidate?tag=${tag}&secret=${encodeURIComponent(secret)}`);
  } catch {
    // Non-critical — storefront cache revalidation failure should not block admin operations
  }
}
