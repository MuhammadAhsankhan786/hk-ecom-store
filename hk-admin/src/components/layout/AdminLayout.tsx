import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import Navbar from './Navbar';
import { Toast } from '../ui/StatusTimeline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentTab, toastMessage } = useAdmin();

  // Standalone pages (Login & Forgot Password)
  if (currentTab === 'login' || currentTab === 'forgot-password') {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center p-4">
        {children}
        <Toast message={toastMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F3] text-[#111111] font-sans antialiased">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E5DE] bg-white py-4 text-center text-xs text-[#6B6B6B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">HK Fabric Admin Enterprise Management Panel &copy; 2026</p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-[#111111]">
            <span>Easypaisa Gateway Sync Active</span>
            <span>•</span>
            <span>Cloudinary Image CDN</span>
          </div>
        </div>
      </footer>

      {/* Global Toast Notifications */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default AdminLayout;
