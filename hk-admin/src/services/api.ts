/**
 * HK Fabric Admin Panel — Full API Client
 * Connects hk-admin to NestJS REST Backend (http://localhost:5000)
 * All product/category mutations go through the real backend API.
 */
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'https://hk-backend-bice.vercel.app'
    : 'http://localhost:5000'
);

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('hk_admin_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
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
      // Optionally trigger logout logic here if needed
      localStorage.removeItem('hk_admin_token');
      localStorage.setItem('hk_admin_auth', 'false');
      // A full reload can force context reset, but better to just show toast
      setTimeout(() => window.location.reload(), 1500);
    }
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function loginAdminAPI(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
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

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function fetchAdminOrdersAPI() {
  try {
    return await apiRequest('/orders');
  } catch {
    return null;
  }
}

// ─── MEDIA UPLOAD (Cloudinary via Backend) ───────────────────────────────────

export async function uploadMediaToCloudinaryAPI(file: File, folder = 'products') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const token = localStorage.getItem('hk_admin_token');
  const res = await fetch(`${API_BASE}/media/upload`, {
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
    const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || (
      typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'https://hk-ecom-store.vercel.app'
        : 'http://localhost:3000'
    );
    const secret = 'hk_fabric_revalidation_secret_2026';
    await fetch(`${storefrontUrl}/api/revalidate?tag=${tag}&secret=${secret}`);
  } catch {
    // Non-critical — storefront cache revalidation failure should not block admin operations
  }
}
