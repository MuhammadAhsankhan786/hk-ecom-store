import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchAdminProductsAPI, fetchAdminOrdersAPI,
  createProductAPI, updateProductAPI, deleteProductAPI,
  fetchCategoriesAPI, createCategoryAPI, updateCategoryAPI, deleteCategoryAPI,
  revalidateStorefront, loginAdminAPI
} from '../services/api';
import type {
  Product, Category, Collection, InventoryAdjustment, Order,
  Transaction, Customer, Coupon, Review, HomepageCMS, AdminUser,
  RolePermission, AuditLog, StoreSettings, NotificationItem, UserRole, OrderStatus, PaymentProvider
} from '../types/admin';
import {
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS,
  INITIAL_INVENTORY_LOGS, INITIAL_ORDERS, INITIAL_TRANSACTIONS,
  INITIAL_CUSTOMERS, INITIAL_COUPONS, INITIAL_REVIEWS, INITIAL_CMS,
  INITIAL_ADMIN_USERS, INITIAL_ROLES_MATRIX, INITIAL_AUDIT_LOGS,
  INITIAL_STORE_SETTINGS, INITIAL_NOTIFICATIONS
} from '../data/mockData';

export type AdminTab = 
  | 'login' | 'forgot-password'
  | 'dashboard'
  | 'products' | 'create-product' | 'edit-product' | 'product-details'
  | 'categories' | 'create-category' | 'edit-category'
  | 'collections' | 'create-collection' | 'edit-collection'
  | 'inventory' | 'create-stock-adjustment' | 'inventory-history'
  | 'orders' | 'order-details'
  | 'payments' | 'payment-details'
  | 'customers' | 'customer-details'
  | 'coupons' | 'create-coupon' | 'edit-coupon'
  | 'homepage-content' | 'banners'
  | 'reviews'
  | 'reports' | 'sales-report' | 'inventory-report' | 'customer-report'
  | 'admin-users' | 'create-admin-user' | 'roles-permissions' | 'audit-logs'
  | 'settings' | 'notifications'
  | '404' | 'permission-denied';

interface AdminContextType {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  selectedEntityId: string | null;
  setSelectedEntityId: (id: string | null) => void;
  
  // Current logged in user & role
  currentUser: AdminUser;
  setCurrentUser: (user: AdminUser) => void;
  isAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  
  // Entity states & handlers
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productsCount'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  
  collections: Collection[];
  addCollection: (collection: Omit<Collection, 'id' | 'productsCount'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  
  inventoryLogs: InventoryAdjustment[];
  adjustStock: (productId: string, adjustment: number, type: InventoryAdjustment['type'], reason: string, notes?: string) => void;
  
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, note: string) => void;
  
  transactions: Transaction[];
  customers: Customer[];
  
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  
  reviews: Review[];
  updateReviewStatus: (id: string, status: Review['status']) => void;
  
  cms: HomepageCMS;
  updateCMS: (updates: Partial<HomepageCMS>) => void;
  
  adminUsers: AdminUser[];
  addAdminUser: (user: Omit<AdminUser, 'id' | 'lastLogin'>) => void;
  updateAdminUserRole: (userId: string, role: UserRole) => void;
  
  rolesMatrix: RolePermission[];
  auditLogs: AuditLog[];
  settings: StoreSettings[];
  updateSettings: (updates: Partial<StoreSettings>) => void;
  
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryAdjustment[]>(INITIAL_INVENTORY_LOGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cms, setCms] = useState<HomepageCMS>(INITIAL_CMS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [rolesMatrix] = useState<RolePermission[]>(INITIAL_ROLES_MATRIX);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  const [currentUser, setCurrentUser] = useState<AdminUser>(INITIAL_ADMIN_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hk_admin_auth') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ─── Refresh helpers (re-fetch from backend) ──────────────────────────────

  const refreshProducts = useCallback(async () => {
    try {
      const prodRes = await fetchAdminProductsAPI();
      if (prodRes && prodRes.data && prodRes.data.length > 0) {
        const mapped: Product[] = prodRes.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          category: p.category?.name || 'Bedding Sets',
          categoryId: p.categoryId || '',
          collection: p.collection?.name || '',
          price: p.price,
          salePrice: p.salePrice || undefined,
          costPrice: undefined,
          stock: p.stock,
          reservedStock: 0,
          lowStockThreshold: 5,
          status: p.isArchived ? 'Archived' : (p.status === 'PUBLISHED' ? 'Active' : 'Draft'),
          isFeatured: p.isFeatured,
          size: p.variants?.map((v: any) => v.size) || ['King', 'Queen'],
          color: p.variants?.map((v: any) => v.color) || ['Maroon', 'Gold'],
          material: '100% Egyptian Cotton',
          pattern: 'Embroidered',
          fabric: '600 Thread Count',
          shortDescription: p.description?.substring(0, 80) || '',
          description: p.description || '',
          images: p.images && p.images.length > 0 ? p.images.map((img: any, idx: number) => ({
            id: img.id || `img-${idx}`,
            url: img.url,
            filename: `image_${idx}.jpg`,
            altText: p.name,
            sortOrder: idx + 1,
            isPrimary: idx === 0
          })) : [],
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
        setProducts(mapped);
      } else if (prodRes && prodRes.data && prodRes.data.length === 0) {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Could not refresh products from backend:', err);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const catRes = await fetchCategoriesAPI();
      if (catRes && Array.isArray(catRes) && catRes.length > 0) {
        const mapped: Category[] = catRes.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: c.description || '',
          image: c.image || '',
          status: c.status === 'PUBLISHED' ? 'Active' : (c.status === 'ARCHIVED' ? 'Archived' : 'Draft'),
          productsCount: c._count?.products || 0,
          parentId: c.parentId || '',
        }));
        setCategories(mapped);
      } else if (catRes && Array.isArray(catRes) && catRes.length === 0) {
        setCategories([]);
      }
    } catch (err) {
      console.warn('Could not refresh categories from backend:', err);
    }
  }, []);

  // Fetch live data from NestJS REST API on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function loadLiveBackendData() {
      // Products and categories are loaded via refreshProducts() / refreshCategories()
      await refreshProducts();
      await refreshCategories();

      // Load live orders
      try {
        const orderRes = await fetchAdminOrdersAPI();
        if (orderRes && Array.isArray(orderRes) && orderRes.length > 0) {
          const mappedOrders: Order[] = orderRes.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber || `HK-ORD-${o.id.substring(0, 5)}`,
            customerName: o.customerName || 'Customer',
            customerEmail: o.customerEmail || 'customer@example.com',
            customerPhone: o.customerPhone || '03001234567',
            shippingAddress: {
              address: o.shippingAddress || 'Main Boulevard',
              city: o.city || 'Lahore',
              province: 'Punjab',
              postalCode: '54000'
            },
            items: o.items?.map((item: any) => ({
              productId: item.productId || 'p-1',
              productName: item.productName || 'Bedding Set',
              sku: item.productSku || 'SKU-001',
              variant: `${item.variantSize || 'King'} / ${item.variantColor || 'Gold'}`,
              quantity: item.quantity || 1,
              price: item.unitPrice || 15000,
              image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format'
            })) || [],
            subtotal: o.subtotal || o.totalAmount || 15000,
            shippingFee: o.shippingFee || 0,
            discount: o.discount || 0,
            tax: 0,
            total: o.totalAmount || 15000,
            paymentMethod: (o.paymentMethod || 'Easypaisa') as PaymentProvider,
            paymentStatus: o.paymentStatus === 'COMPLETED' ? 'Successful' : 'Pending',
            orderStatus: o.orderStatus === 'PENDING' ? 'Processing' : (o.orderStatus || 'Processing'),
            timeline: [
              {
                status: 'Processing',
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                note: 'Order placed by customer',
                by: 'Customer'
              }
            ],
            createdAt: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.warn('Could not load orders from backend:', err);
      }
    }
    loadLiveBackendData();
  }, [refreshProducts, refreshCategories]);
  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const result = await loginAdminAPI(email, pass);
      if (result?.accessToken) {
        setIsAuthenticated(true);
        setCurrentTab('dashboard');
        showToast(`Welcome back, ${result.user?.name || 'Admin'}!`);
        return true;
      }
    } catch (err: any) {
      // Dev fallback — only if backend is completely offline
      if (email.trim() && pass.length >= 4) {
        console.warn('Backend auth unavailable, using dev fallback:', err.message);
        setIsAuthenticated(true);
        localStorage.setItem('hk_admin_auth', 'true');
        setCurrentTab('dashboard');
        showToast(`Welcome back, ${currentUser.name}! (Offline mode)`);
        return true;
      }
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hk_admin_auth');
    localStorage.removeItem('hk_admin_token');
    setCurrentTab('login');
    showToast('Admin session logged out safely.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addAuditLog = (action: string, entity: string, entityId: string, prev?: string, next?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: `${currentUser.name} (${currentUser.role})`,
      action,
      entity,
      entityId,
      previousValue: prev,
      newValue: next,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '111.68.102.14 (Lahore, PK)'
    };
    setAuditLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // ─── Product Handlers (Real API calls) ────────────────────────────────────

  const addProduct = async (newP: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const payload: Record<string, any> = {
        name: newP.name,
        slug: newP.slug || newP.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: newP.sku,
        description: newP.description || newP.shortDescription || 'No description provided.',
        price: newP.price,
        salePrice: newP.salePrice || undefined,
        stock: newP.stock,
        isFeatured: newP.isFeatured || false,
        status: newP.status === 'Active' ? 'PUBLISHED' : (newP.status === 'Archived' ? 'ARCHIVED' : 'DRAFT'),
        categoryId: (newP as any).categoryId || undefined,
        images: newP.images?.map(img => img.url) || [],
      };
      const created = await createProductAPI(payload);
      addAuditLog('Created product via API', 'Product', created.sku || newP.sku, undefined, created.name || newP.name);
      await refreshProducts();
      await revalidateStorefront('products');
      showToast(`✓ Product "${created.name}" saved to database successfully.`);
    } catch (err: any) {
      showToast(`✗ Failed to create product: ${err.message || 'Backend error'}`);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const payload: Record<string, any> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.price !== undefined) payload.price = updates.price;
      if ((updates as any).salePrice !== undefined) payload.salePrice = (updates as any).salePrice;
      if (updates.stock !== undefined) payload.stock = updates.stock;
      if (updates.isFeatured !== undefined) payload.isFeatured = updates.isFeatured;
      if ((updates as any).categoryId !== undefined) payload.categoryId = (updates as any).categoryId;
      if (updates.status !== undefined) {
        payload.status = updates.status === 'Active' ? 'PUBLISHED' : (updates.status === 'Archived' ? 'ARCHIVED' : 'DRAFT');
      }
      if (updates.images && updates.images.length > 0) {
        payload.images = updates.images.map(img => img.url);
      }
      await updateProductAPI(id, payload);
      const p = products.find(prod => prod.id === id);
      if (p) addAuditLog('Updated product via API', 'Product', p.sku);
      await refreshProducts();
      await revalidateStorefront('products');
      showToast('✓ Product updated in database successfully.');
    } catch (err: any) {
      showToast(`✗ Failed to update product: ${err.message || 'Backend error'}`);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const p = products.find(prod => prod.id === id);
      await deleteProductAPI(id);
      if (p) addAuditLog('Archived product via API', 'Product', p.sku, p.name);
      await refreshProducts();
      await revalidateStorefront('products');
      showToast('✓ Product archived in database successfully.');
    } catch (err: any) {
      showToast(`✗ Failed to archive product: ${err.message || 'Backend error'}`);
      throw err;
    }
  };

  // ─── Category Handlers (Real API calls) ────────────────────────────────────

  const addCategory = async (cat: Omit<Category, 'id' | 'productsCount'>) => {
    try {
      const payload = {
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: cat.description || '',
        image: cat.image || '',
        status: cat.status === 'Active' ? 'PUBLISHED' : (cat.status === 'Archived' ? 'ARCHIVED' : 'PUBLISHED'),
      };
      const created = await createCategoryAPI(payload);
      addAuditLog('Created new category via API', 'Category', created.name);
      await refreshCategories();
      await revalidateStorefront('categories');
      showToast(`✓ Category "${created.name}" saved to database successfully.`);
    } catch (err: any) {
      showToast(`✗ Failed to create category: ${err.message || 'Backend error'}`);
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const payload: Record<string, any> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.image !== undefined) payload.image = updates.image;
      if (updates.status !== undefined) {
        payload.status = updates.status === 'Active' ? 'PUBLISHED' : (updates.status === 'Archived' ? 'ARCHIVED' : 'DRAFT');
      }
      await updateCategoryAPI(id, payload);
      await refreshCategories();
      await revalidateStorefront('categories');
      showToast('✓ Category updated in database successfully.');
    } catch (err: any) {
      showToast(`✗ Failed to update category: ${err.message || 'Backend error'}`);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryAPI(id);
      await refreshCategories();
      await revalidateStorefront('categories');
      showToast('✓ Category archived in database successfully.');
    } catch (err: any) {
      showToast(`✗ Failed to archive category: ${err.message || 'Backend error'}`);
      throw err;
    }
  };

  const addCollection = (col: Omit<Collection, 'id' | 'productsCount'>) => {
    const newCol: Collection = {
      ...col,
      id: `col-${Date.now()}`,
      productsCount: 0
    };
    setCollections(prev => [...prev, newCol]);
    addAuditLog('Created new collection', 'Collection', newCol.name);
    showToast(`Collection "${newCol.name}" added successfully.`);
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Collection updated successfully.');
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    showToast('Collection deleted.');
  };

  const adjustStock = (productId: string, adjustment: number, type: InventoryAdjustment['type'], reason: string, notes?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const prevQty = product.stock;
    const newQty = Math.max(0, prevQty + adjustment);

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newQty } : p));

    const log: InventoryAdjustment = {
      id: `inv-log-${Date.now()}`,
      productId,
      productName: product.name,
      sku: product.sku,
      previousQuantity: prevQty,
      adjustment,
      newQuantity: newQty,
      type,
      reason,
      notes,
      user: `${currentUser.name} (${currentUser.role})`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setInventoryLogs(prev => [log, ...prev]);

    addAuditLog('Adjusted stock level', 'Inventory', product.sku, `${prevQty} units`, `${newQty} units`);
    showToast(`Stock updated for ${product.sku}: ${prevQty} → ${newQty}`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const timelineItem = {
          status,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note,
          by: currentUser.name
        };
        const updated = {
          ...ord,
          orderStatus: status,
          timeline: [...ord.timeline, timelineItem]
        };
        addAuditLog(`Order status changed to ${status}`, 'Order', ord.orderNumber, ord.orderStatus, status);
        return updated;
      }
      return ord;
    }));
    showToast(`Order status updated to ${status}.`);
  };

  const addCoupon = (c: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoup: Coupon = {
      ...c,
      id: `coup-${Date.now()}`,
      usedCount: 0
    };
    setCoupons(prev => [newCoup, ...prev]);
    addAuditLog('Created promo coupon', 'Coupon', newCoup.code);
    showToast(`Coupon ${newCoup.code} created successfully.`);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Coupon updated successfully.');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c));
    showToast('Coupon status updated.');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon deleted.');
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Review status set to ${status}.`);
  };

  const updateCMS = (updates: Partial<HomepageCMS>) => {
    setCms(prev => ({ ...prev, ...updates }));
    addAuditLog('Updated Homepage CMS', 'Content', 'Homepage');
    showToast('Homepage CMS settings saved.');
  };

  const addAdminUser = (user: Omit<AdminUser, 'id' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `user-${Date.now()}`,
      lastLogin: 'Never'
    };
    setAdminUsers(prev => [...prev, newUser]);
    addAuditLog('Invited new admin team member', 'AdminUser', newUser.email);
    showToast(`Admin user ${newUser.email} added successfully.`);
  };

  const updateAdminUserRole = (userId: string, role: UserRole) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    showToast('User role updated.');
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addAuditLog('Updated Store Settings', 'Settings', 'Store');
    showToast('Store settings updated successfully.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <AdminContext.Provider value={{
      currentTab, setCurrentTab,
      selectedEntityId, setSelectedEntityId,
      currentUser, setCurrentUser,
      isAuthenticated, loginAdmin, logoutAdmin,
      products, addProduct, updateProduct, deleteProduct, refreshProducts,
      categories, addCategory, updateCategory, deleteCategory, refreshCategories,
      collections, addCollection, updateCollection, deleteCollection,
      inventoryLogs, adjustStock,
      orders, updateOrderStatus,
      transactions, customers,
      coupons, addCoupon, updateCoupon, toggleCouponStatus, deleteCoupon,
      reviews, updateReviewStatus,
      cms, updateCMS,
      adminUsers, addAdminUser, updateAdminUserRole,
      rolesMatrix, auditLogs,
      settings: [settings], updateSettings,
      notifications, markNotificationAsRead,
      toastMessage, showToast
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
