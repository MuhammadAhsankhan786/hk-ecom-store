import React, { useState, useRef, useEffect } from 'react';
import { useAdmin, type AdminTab } from '../../context/AdminContext';
import {
  LayoutDashboard, ShoppingBag, Box, Users, Percent,
  BarChart3, ShieldCheck, ChevronDown,
  Bell, Search, ExternalLink, Shield, CheckCircle, Menu, X, LogOut, KeyRound
} from 'lucide-react';
import Drawer from '../ui/Drawer';
import type { UserRole } from '../../types/admin';

export const Navbar: React.FC = () => {
  const {
    currentTab, setCurrentTab,
    currentUser, setCurrentUser,
    notifications, markNotificationAsRead,
    products, orders, reviews
  } = useAdmin();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Pending Payment').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending').length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab: AdminTab) => {
    setCurrentTab(tab);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser({ ...currentUser, role });
    setIsProfileOpen(false);
  };

  const dropdownMenus = [
    {
      id: 'catalog',
      label: 'Catalog',
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      items: [
        { id: 'products' as AdminTab, title: 'Product Catalog', desc: 'Manage bedding, sheets & inventory', badge: products.length },
        { id: 'create-product' as AdminTab, title: 'Add New Product', desc: 'Cloudinary image upload & attributes' },
        { id: 'categories' as AdminTab, title: 'Categories', desc: 'Bedsheets, Comforters, Blankets, Cushions' },
        { id: 'collections' as AdminTab, title: 'Collections', desc: 'Wedding, Summer 2026, Best Sellers' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Box className="w-3.5 h-3.5" />,
      items: [
        { id: 'inventory' as AdminTab, title: 'Stock & Adjustments', desc: 'Warehouse stock levels & manual overrides', badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
        { id: 'inventory-history' as AdminTab, title: 'Inventory History Log', desc: 'Full audit trail of stock movements' }
      ]
    },
    {
      id: 'orders-crm',
      label: 'Orders & Customers',
      icon: <Users className="w-3.5 h-3.5" />,
      items: [
        { id: 'orders' as AdminTab, title: 'All Customer Orders', desc: 'Fulfillment, shipping labels & invoices', badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
        { id: 'customers' as AdminTab, title: 'Customer Directory CRM', desc: 'Lifetime spend, addresses & order history' }
      ]
    },
    {
      id: 'marketing-cms',
      label: 'Marketing & CMS',
      icon: <Percent className="w-3.5 h-3.5" />,
      items: [
        { id: 'coupons' as AdminTab, title: 'Coupons & Promo Codes', desc: 'Percentage % & fixed PKR discount codes' },
        { id: 'homepage-content' as AdminTab, title: 'Homepage CMS Editor', desc: 'Hero sliders, promo banners & ticker text' },
        { id: 'reviews' as AdminTab, title: 'Product Reviews', desc: 'Moderate customer ratings & reviews', badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined }
      ]
    },
    {
      id: 'finance-reports',
      label: 'Reports & Finance',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      items: [
        { id: 'payments' as AdminTab, title: 'Easypaisa Transactions', desc: 'Gateway verification logs & payloads' },
        { id: 'reports' as AdminTab, title: 'Business Reports', desc: 'Exportable sales, stock & customer analytics' }
      ]
    },
    {
      id: 'admin-settings',
      label: 'Settings & Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      items: [
        { id: 'admin-users' as AdminTab, title: 'Admin Team Directory', desc: 'Invite staff & assign access roles' },
        { id: 'roles-permissions' as AdminTab, title: 'Roles & Matrix', desc: 'Granular permissions matrix' },
        { id: 'audit-logs' as AdminTab, title: 'Enterprise Audit Logs', desc: 'Operational log of all staff edits' },
        { id: 'settings' as AdminTab, title: 'Store Settings', desc: 'Shipping rules, tax & Easypaisa config' }
      ]
    }
  ];

  return (
    <>
      <header ref={dropdownRef} className="bg-[#111111] text-white border-b border-gray-800 sticky top-0 z-40 shadow-xl select-none">
        {/* Top Utility Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8960C] text-black font-extrabold text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                HK
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white uppercase tracking-wider">HK Fabric</span>
                  <span className="text-[10px] bg-[#D4AF37] text-black font-extrabold px-1.5 py-0.2 rounded-xs uppercase">Enterprise</span>
                </div>
                <p className="text-[10px] text-gray-400">Retail Back-Office System</p>
              </div>
            </button>

            {/* Quick Search */}
            <div className="relative w-64 lg:w-72 hidden md:block">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search products, order #, SKU..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:bg-black focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            {/* Live Store Button */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Opening HK Fabric Storefront Preview..."); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Notifications Trigger */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-extrabold rounded-full flex items-center justify-center border border-black">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-[#D4AF37] font-semibold">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-gray-800 bg-black/40">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-400">{currentUser.email}</p>
                  </div>

                  <div className="p-2 space-y-1">
                    <p className="px-2 pt-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Simulate Role Privileges
                    </p>
                    {(['Super Admin', 'Store Manager', 'Inventory Manager', 'Order Manager', 'Content Manager'] as UserRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                          currentUser.role === role ? 'bg-[#222222] text-[#D4AF37] font-bold' : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5" />
                          <span>{role}</span>
                        </div>
                        {currentUser.role === role && <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>
                    ))}
                  </div>

                  {/* Auth Actions */}
                  <div className="p-2 pt-1 border-t border-gray-800 space-y-1">
                    <button
                      onClick={() => handleNavClick('forgot-password')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-gray-300 hover:bg-gray-800 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                      <span>Reset Password</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('login')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-rose-400 hover:bg-rose-950/40 cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Login Screen)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white rounded-lg cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navbar Category Dropdowns (Horizontal Bar) */}
        <div className="hidden lg:block border-t border-gray-800/80 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1">
            {/* Dashboard Direct Button */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                currentTab === 'dashboard'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Mega Dropdowns */}
            {dropdownMenus.map(menu => {
              const isOpen = activeDropdown === menu.id;
              const hasActiveChild = menu.items.some(item => item.id === currentTab);

              return (
                <div key={menu.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : menu.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                      hasActiveChild || isOpen
                        ? 'border-[#D4AF37] text-[#D4AF37]'
                        : 'border-transparent text-gray-300 hover:text-white'
                    }`}
                  >
                    {menu.icon}
                    <span>{menu.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-[#D4AF37]' : 'text-gray-500'}`} />
                  </button>

                  {/* Mega Dropdown Panel */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="space-y-1">
                        {menu.items.map(item => {
                          const isActive = currentTab === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNavClick(item.id);
                              }}
                              className={`w-full text-left p-2.5 rounded-lg transition-colors cursor-pointer ${
                                isActive ? 'bg-[#222222] text-[#D4AF37]' : 'hover:bg-gray-800 text-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs">{item.title}</span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#D4AF37] text-black rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col">
          <div className="bg-[#111111] p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black font-bold flex items-center justify-center">HK</div>
              <span className="font-bold text-sm text-white">HK Admin Menu</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 text-white">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full text-left px-4 py-3 bg-gray-800 rounded-xl font-bold text-sm text-[#D4AF37] flex items-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard Overview</span>
            </button>

            {dropdownMenus.map(menu => (
              <div key={menu.id} className="space-y-2">
                <p className="text-xs font-extrabold uppercase text-[#D4AF37] tracking-wider px-2">{menu.label}</p>
                <div className="space-y-1">
                  {menu.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                        currentTab === item.id ? 'bg-[#D4AF37] text-black' : 'bg-gray-800 text-gray-200'
                      }`}
                    >
                      <span>{item.title}</span>
                      {item.badge && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black text-[#D4AF37] rounded-full">{item.badge}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        title="Notifications Drawer"
        width="md"
      >
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                n.isRead ? 'bg-white border-[#E8E5DE]' : 'bg-[#FDF9EC] border-[#F5E6B3] ring-1 ring-[#D4AF37]/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-xs text-[#111111]">{n.title}</span>
                <span className="text-[10px] text-[#6B6B6B]">{n.createdAt}</span>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
