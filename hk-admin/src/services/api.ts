/**
 * HK Fabric Admin Panel API Client
 * Connects hk-admin directly to NestJS REST Backend (http://localhost:5000)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('hk_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAdminDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/reports/dashboard`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAdminProductsAPI() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAdminOrdersAPI() {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function uploadMediaToCloudinaryAPI(file: File, folder = 'products') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE}/media/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Media upload failed with status ${res.status}`);
  }

  return await res.json();
}
