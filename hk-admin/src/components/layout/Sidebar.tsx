import React, { useState } from 'react';
import { useAdmin, type AdminTab } from '../../context/AdminContext';
import {
  LayoutDashboard, ShoppingBag, Box,
  ShoppingBag as OrderIcon, Users, Percent, Image, MessageSquare,
  CreditCard, BarChart3, ShieldCheck, Settings, ChevronDown, ChevronRight
} from 'lucide-react';

interface NavItem {
  id: AdminTab;
  label: string;
  badge?: string | number;
}

interface NavGroup {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { currentTab, setCurrentTab, products, orders, reviews } = useAdmin();

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Pending Payment').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending').length;

  const navGroups: NavGroup[] = [
    {
      title: 'Catalog',
      icon: <ShoppingBag className="w-4 h-4" />,
      items: [
        { id: 'products', label: 'Products', badge: products.length },
        { id: 'categories', label: 'Categories' },
        { id: 'collections', label: 'Collections' }
      ]
    },
    {
      title: 'Inventory',
      icon: <Box className="w-4 h-4" />,
      items: [
        { id: 'inventory', label: 'Stock & Adjustments', badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
        { id: 'inventory-history', label: 'Inventory History' }
      ]
    },
    {
      title: 'Orders',
      icon: <OrderIcon className="w-4 h-4" />,
      items: [
        { id: 'orders', label: 'All Orders', badge: pendingOrdersCount }
      ]
    },
    {
      title: 'Customers',
      icon: <Users className="w-4 h-4" />,
      items: [
        { id: 'customers', label: 'Customers List' }
      ]
    },
    {
      title: 'Marketing',
      icon: <Percent className="w-4 h-4" />,
      items: [
        { id: 'coupons', label: 'Coupons & Discounts' },
        { id: 'banners', label: 'Banners & Promos' }
      ]
    },
    {
      title: 'Content',
      icon: <Image className="w-4 h-4" />,
      items: [
        { id: 'homepage-content', label: 'Homepage CMS' }
      ]
    },
    {
      title: 'Reviews',
      icon: <MessageSquare className="w-4 h-4" />,
      items: [
        { id: 'reviews', label: 'Product Reviews', badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined }
      ]
    },
    {
      title: 'Payments',
      icon: <CreditCard className="w-4 h-4" />,
      items: [
        { id: 'payments', label: 'Easypaisa Transactions' }
      ]
    },
    {
      title: 'Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      items: [
        { id: 'reports', label: 'Business Reports' }
      ]
    },
    {
      title: 'Administration',
      icon: <ShieldCheck className="w-4 h-4" />,
      items: [
        { id: 'admin-users', label: 'Admin Users' },
        { id: 'roles-permissions', label: 'Roles & Matrix' },
        { id: 'audit-logs', label: 'Audit Logs' }
      ]
    }
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Catalog: true,
    Orders: true,
    Inventory: true
  });

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
  };

  const handleNavClick = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-[#111111] text-white h-full flex flex-col border-r border-gray-800 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black font-extrabold text-lg shadow-sm">
            HK
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white uppercase">HK Fabric</h1>
            <p className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase">Admin Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {/* Dashboard Link */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentTab === 'dashboard'
              ? 'bg-[#D4AF37] text-black shadow-xs font-bold'
              : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </button>

        {/* Group Accordions */}
        {navGroups.map(group => {
          const isOpen = openGroups[group.title];
          const hasActiveChild = group.items.some(i => i.id === currentTab);

          return (
            <div key={group.title} className="space-y-0.5 pt-1">
              <button
                onClick={() => toggleGroup(group.title)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  hasActiveChild ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {group.icon}
                  <span className="font-semibold">{group.title}</span>
                </div>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isOpen && (
                <div className="pl-6 space-y-0.5">
                  {group.items.map(item => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#222222] text-[#D4AF37] border-l-2 border-[#D4AF37] font-semibold'
                            : 'text-gray-400 hover:text-white hover:bg-gray-900'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                            isActive ? 'bg-[#D4AF37] text-black' : 'bg-gray-800 text-gray-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Settings Direct Link */}
        <div className="pt-2">
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'settings'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-800 bg-[#0B0B0B] text-xs text-gray-500 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400">HK Admin v2.4</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Normal" />
        </div>
        <p className="text-[10px] text-gray-500">Easypaisa Live Gateway Sync</p>
      </div>
    </aside>
  );
};

export default Sidebar;
