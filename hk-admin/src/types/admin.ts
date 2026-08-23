export type OrderStatus = 'Pending Payment' | 'Paid' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';

export type PaymentStatus = 'Initiated' | 'Pending' | 'Successful' | 'Failed' | 'Refunded';

export type PaymentProvider = 'Easypaisa' | 'Cash on Delivery' | 'Credit/Debit Card';

export type UserRole = 'Super Admin' | 'Store Manager' | 'Inventory Manager' | 'Order Manager' | 'Content Manager';

export interface ImageMetadata {
  id: string;
  url: string;
  filename: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subcategory?: string;
  collection?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  status: 'Active' | 'Draft' | 'Archived';
  isFeatured: boolean;
  size: string[];
  color: string[];
  material: string;
  pattern: string;
  fabric: string;
  description: string;
  shortDescription: string;
  images: ImageMetadata[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  parentName?: string;
  productsCount: number;
  status: 'Active' | 'Inactive';
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productsCount: number;
  sortOrder: number;
  status: 'Active' | 'Inactive';
  seoTitle: string;
  seoDescription: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  previousQuantity: number;
  adjustment: number;
  newQuantity: number;
  type: 'Purchase Order' | 'Damage' | 'Customer Return' | 'Audit Correction' | 'Restock';
  reason: string;
  notes?: string;
  user: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
  by: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentProvider;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  easypaisaTxnId?: string;
  orderStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  orderId: string;
  customerName: string;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
  rawPayload?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Active' | 'Blocked';
  addresses: {
    title: string;
    address: string;
    city: string;
    province: string;
    isDefault: boolean;
  }[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  perCustomerLimit: number;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Disabled';
  applicableCategories?: string[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hidden';
  createdAt: string;
}

export interface HeroBanner {
  id: string;
  image: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface PromotionalBanner {
  id: string;
  image: string;
  heading: string;
  discountTag: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface HomepageCMS {
  heroBanners: HeroBanner[];
  featuredProductIds: string[];
  featuredCollectionIds: string[];
  promotionalBanner: PromotionalBanner;
  announcementBarText: string;
  isAnnouncementActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}

export interface RolePermission {
  role: UserRole;
  description: string;
  permissions: {
    products: boolean;
    orders: boolean;
    inventory: boolean;
    customers: boolean;
    content: boolean;
    reports: boolean;
    settings: boolean;
  };
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  easypaisaMerchantId: string;
  easypaisaStoreId: string;
  easypaisaSecretMasked: string;
  isEasypaisaLive: boolean;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  taxRatePercent: number;
  orderNotificationEmails: string;
  seoTitle: string;
  seoDescription: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system' | 'payment';
  isRead: boolean;
  createdAt: string;
}
