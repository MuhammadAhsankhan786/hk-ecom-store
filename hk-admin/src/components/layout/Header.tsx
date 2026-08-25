import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, Bell, Menu, ExternalLink, Shield, ChevronDown, CheckCircle } from 'lucide-react';
import Drawer from '../ui/Drawer';
import type { UserRole } from '../../types/admin';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    currentUser, setCurrentUser,
    notifications, markNotificationAsRead,
    logoutAdmin
  } = useAdmin();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser({ ...currentUser, role });
    setIsProfileOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E8E5DE] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Left: Mobile Toggle & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-[#111111] hover:bg-[#F8F7F3] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search */}
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Search products, order #, customers, SKU..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F7F3] border border-[#E8E5DE] rounded-lg text-[#111111] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Actions & Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Storefront Link */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); alert("Opening HK Fabric Customer Storefront Preview..."); }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111111] bg-[#F8F7F3] border border-[#E8E5DE] rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-lg text-[#111111] hover:bg-[#F8F7F3] transition-colors cursor-pointer"
            title="System Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F8F7F3] transition-colors cursor-pointer border border-transparent hover:border-[#E8E5DE]"
            >
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs border border-[#D4AF37]">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#111111] leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-[#D4AF37] font-semibold">{currentUser.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B]" />
            </button>

            {/* Profile Dropdown Content */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E8E5DE] py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-[#E8E5DE] bg-[#F8F7F3]">
                  <p className="text-xs font-bold text-[#111111]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{currentUser.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <p className="px-2 pt-1 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                    Simulate Role Access
                  </p>
                  {(['Super Admin', 'Store Manager', 'Inventory Manager', 'Order Manager', 'Content Manager'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                        currentUser.role === role ? 'bg-[#FDF9EC] text-[#D4AF37] font-bold' : 'text-[#111111] hover:bg-[#F8F7F3]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        <span>{role}</span>
                      </div>
                      {currentUser.role === role && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                  ))}

                  <div className="pt-2 border-t border-[#E8E5DE] mt-1">
                    <button
                      type="button"
                      onClick={() => { setIsProfileOpen(false); logoutAdmin(); }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <span>Sign Out Admin</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        title="Admin Notifications"
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
                <div className="flex items-center gap-2 font-bold text-xs text-[#111111]">
                  <span>{n.title}</span>
                </div>
                <span className="text-[10px] text-[#6B6B6B]">{n.createdAt}</span>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default Header;
