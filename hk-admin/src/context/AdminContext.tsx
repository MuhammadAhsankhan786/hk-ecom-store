import React, { createContext, useContext, useState } from 'react';
import type {
  Product, Category, Collection, InventoryAdjustment, Order,
  Transaction, Customer, Coupon, Review, HomepageCMS, AdminUser,
  RolePermission, AuditLog, StoreSettings, NotificationItem, UserRole, OrderStatus
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
  
  // Entity states & handlers
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productsCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Handlers
  const addProduct = (newP: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newP,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [product, ...prev]);
    addAuditLog('Created product', 'Product', product.sku, undefined, product.name);
    showToast(`Product "${product.name}" created successfully.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        addAuditLog('Updated product details', 'Product', p.sku);
        return updated;
      }
      return p;
    }));
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    const p = products.find(prod => prod.id === id);
    setProducts(prev => prev.filter(prod => prod.id !== id));
    if (p) addAuditLog('Deleted product', 'Product', p.sku, p.name);
    showToast('Product removed from catalog.');
  };

  const addCategory = (cat: Omit<Category, 'id' | 'productsCount'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      productsCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    addAuditLog('Created new category', 'Category', newCat.name);
    showToast(`Category "${newCat.name}" added successfully.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Category updated successfully.');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted.');
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
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
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
