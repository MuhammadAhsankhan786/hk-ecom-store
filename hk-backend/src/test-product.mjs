import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000';

async function testProduct() {
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@hkfabric.pk', password: 'admin123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;

  // Create Product as DRAFT
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: `QA Silk Bedspread ${Date.now()}`,
      slug: `qa-silk-bedspread-${Date.now()}`,
      sku: `SKU-DUVET-${Date.now()}`,
      description: 'Luxury embroidered duvet set',
      price: 19500,
      stock: 10,
      status: 'DRAFT',
      images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'],
    }),
  });

  console.log('Create Product status:', res.status);
  const data = await res.json();
  console.log('Create Product response:', data);

  if (data.id) {
    // Check public storefront API
    const storeRes = await fetch(`${API_BASE}/products`);
    const storeData = await storeRes.json();
    const isVisibleInStore = storeData.data?.some(p => p.id === data.id);
    console.log('Visible on storefront when DRAFT?:', isVisibleInStore); // Expected: false

    // Publish
    const pubRes = await fetch(`${API_BASE}/products/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'PUBLISHED' }),
    });
    console.log('Publish status:', pubRes.status);
    const pubData = await pubRes.json();
    console.log('Published product data:', pubData);

    // Check public storefront API again
    const storeRes2 = await fetch(`${API_BASE}/products`);
    const storeData2 = await storeRes2.json();
    const isVisibleInStore2 = storeData2.data?.some(p => p.id === data.id);
    console.log('Visible on storefront when PUBLISHED?:', isVisibleInStore2); // Expected: true
  }
}

testProduct();
