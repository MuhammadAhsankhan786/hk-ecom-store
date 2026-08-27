import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from 'react-hot-toast';

// Screen Imports
import DashboardPage from './pages/DashboardPage';
import { ProductsListPage, ProductFormPage, ProductDetailsPage } from './pages/ProductsPages';
import { CategoriesPage, CollectionsPage } from './pages/CategoriesPage';
import CategoryFormPage from './pages/CategoryFormPage';
import CollectionFormPage from './pages/CollectionFormPage';
import { InventoryPage, InventoryHistoryPage } from './pages/InventoryPages';
import StockAdjustmentFormPage from './pages/StockAdjustmentFormPage';
import { OrdersListPage, OrderDetailsPage } from './pages/OrdersPages';
import { PaymentsPage } from './pages/PaymentsPages';
import { CustomersPage } from './pages/CustomersPages';
import { CouponsPage } from './pages/CouponsPages';
import CouponFormPage from './pages/CouponFormPage';
import { HomepageContentPage } from './pages/HomepageContentPages';
import { ReviewsPage } from './pages/ReviewsPage';
import { ReportsPage } from './pages/ReportsPages';
import { AdminUsersPage, RolesPermissionsPage } from './pages/AdminUsersPages';
import AdminUserFormPage from './pages/AdminUserFormPage';
import { AuditLogsPage, SettingsPage } from './pages/AuditLogsPage';
import { LoginPage, ForgotPasswordPage } from './pages/AuthPages';
import { PermissionDeniedPage, NotFoundPage } from './pages/SystemPages';

const MainContentRouter: React.FC = () => {
  const { currentTab, currentUser } = useAdmin();

  // Role Access Checker
  const checkPermission = (allowedRoles: string[]): boolean => {
    if (currentUser.role === 'Super Admin') return true;
    return allowedRoles.includes(currentUser.role);
  };

  switch (currentTab) {
    case 'login':
      return <LoginPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;

    case 'dashboard':
      return <DashboardPage />;

    // Catalog & Products Form Pages
    case 'products':
      return checkPermission(['Store Manager', 'Inventory Manager', 'Content Manager']) 
        ? <ProductsListPage /> : <PermissionDeniedPage />;
    case 'create-product':
      return checkPermission(['Store Manager', 'Inventory Manager']) 
        ? <ProductFormPage isEdit={false} /> : <PermissionDeniedPage />;
    case 'edit-product':
      return checkPermission(['Store Manager', 'Inventory Manager']) 
        ? <ProductFormPage isEdit={true} /> : <PermissionDeniedPage />;
    case 'product-details':
      return <ProductDetailsPage />;

    // Categories Form Pages
    case 'categories':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CategoriesPage /> : <PermissionDeniedPage />;
    case 'create-category':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CategoryFormPage isEdit={false} /> : <PermissionDeniedPage />;
    case 'edit-category':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CategoryFormPage isEdit={true} /> : <PermissionDeniedPage />;

    // Collections Form Pages
    case 'collections':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CollectionsPage /> : <PermissionDeniedPage />;
    case 'create-collection':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CollectionFormPage isEdit={false} /> : <PermissionDeniedPage />;
    case 'edit-collection':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CollectionFormPage isEdit={true} /> : <PermissionDeniedPage />;

    // Inventory & Stock Adjustment Form Pages
    case 'inventory':
      return checkPermission(['Store Manager', 'Inventory Manager']) ? <InventoryPage /> : <PermissionDeniedPage />;
    case 'create-stock-adjustment':
      return checkPermission(['Store Manager', 'Inventory Manager']) ? <StockAdjustmentFormPage /> : <PermissionDeniedPage />;
    case 'inventory-history':
      return checkPermission(['Store Manager', 'Inventory Manager']) ? <InventoryHistoryPage /> : <PermissionDeniedPage />;

    // Orders
    case 'orders':
      return checkPermission(['Store Manager', 'Order Manager']) ? <OrdersListPage /> : <PermissionDeniedPage />;
    case 'order-details':
      return checkPermission(['Store Manager', 'Order Manager']) ? <OrderDetailsPage /> : <PermissionDeniedPage />;

    // Payments & Customers
    case 'payments':
      return checkPermission(['Store Manager']) ? <PaymentsPage /> : <PermissionDeniedPage />;
    case 'customers':
    case 'customer-details':
      return checkPermission(['Store Manager', 'Order Manager']) ? <CustomersPage /> : <PermissionDeniedPage />;

    // Coupons & Marketing Form Pages
    case 'coupons':
    case 'banners':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CouponsPage /> : <PermissionDeniedPage />;
    case 'create-coupon':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CouponFormPage isEdit={false} /> : <PermissionDeniedPage />;
    case 'edit-coupon':
      return checkPermission(['Store Manager', 'Content Manager']) ? <CouponFormPage isEdit={true} /> : <PermissionDeniedPage />;

    // CMS & Content
    case 'homepage-content':
      return checkPermission(['Store Manager', 'Content Manager']) ? <HomepageContentPage /> : <PermissionDeniedPage />;

    // Reviews & Reports
    case 'reviews':
      return checkPermission(['Store Manager', 'Content Manager']) ? <ReviewsPage /> : <PermissionDeniedPage />;
    case 'reports':
    case 'sales-report':
    case 'inventory-report':
    case 'customer-report':
      return checkPermission(['Store Manager', 'Inventory Manager']) ? <ReportsPage /> : <PermissionDeniedPage />;

    // Administration & User Form Pages
    case 'admin-users':
      return checkPermission([]) ? <AdminUsersPage /> : <PermissionDeniedPage />;
    case 'create-admin-user':
      return checkPermission([]) ? <AdminUserFormPage /> : <PermissionDeniedPage />;
    case 'roles-permissions':
      return checkPermission([]) ? <RolesPermissionsPage /> : <PermissionDeniedPage />;
    case 'audit-logs':
      return checkPermission([]) ? <AuditLogsPage /> : <PermissionDeniedPage />;
    case 'settings':
      return checkPermission([]) ? <SettingsPage /> : <PermissionDeniedPage />;

    default:
      return <NotFoundPage />;
  }
};

const AdminAppContainer: React.FC = () => {
  const { isAuthenticated, currentTab } = useAdmin();

  if (!isAuthenticated) {
    if (currentTab === 'forgot-password') {
      return <ForgotPasswordPage />;
    }
    return <LoginPage />;
  }

  return (
    <AdminLayout>
      <MainContentRouter />
    </AdminLayout>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <Toaster position="top-right" />
      <AdminAppContainer />
    </AdminProvider>
  );
}
