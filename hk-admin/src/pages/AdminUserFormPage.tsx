import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, UserPlus, Shield } from 'lucide-react';
import type { UserRole } from '../types/admin';

export const AdminUserFormPage: React.FC = () => {
  const { setCurrentTab, addAdminUser } = useAdmin();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Store Manager');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addAdminUser({
      name, email, role, status
    });
    setCurrentTab('admin-users');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('admin-users')}
            className="p-2 bg-white border border-[#E8E5DE] rounded-xl text-[#111111] hover:bg-[#F8F7F3] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111111]">Invite Admin Staff User</h1>
            <p className="text-xs text-[#6B6B6B]">Assign store management roles & privileges to team members</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCurrentTab('admin-users')}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSubmit} icon={<Save className="w-3.5 h-3.5" />}>
            Send Invitation & Grant Access
          </Button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>Staff Profile Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood, Mariam Farooq"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tariq.inventory@hkfabric.pk"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Assigned Operational Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold text-[#111111]"
                >
                  <option value="Super Admin">Super Admin (Full Store Access)</option>
                  <option value="Store Manager">Store Manager (Products, Orders & Inventory)</option>
                  <option value="Inventory Manager">Inventory Manager (Stock & Catalog)</option>
                  <option value="Order Manager">Order Manager (Order Fulfillment & CRM)</option>
                  <option value="Content Manager">Content Manager (CMS, Promos & Reviews)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>Role Privilege Summary</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] space-y-1">
                <p className="font-bold text-[#111111]">{role}</p>
                <p className="text-[11px] text-[#6B6B6B]">
                  {role === 'Super Admin' && 'Unrestricted access to store settings, team management, and financial reports.'}
                  {role === 'Store Manager' && 'Can add/edit catalog, adjust stock, process orders, and moderate reviews.'}
                  {role === 'Inventory Manager' && 'Restricted to catalog management, warehouse stock levels, and inventory history.'}
                  {role === 'Order Manager' && 'Restricted to customer order fulfillment, shipping labels, and customer CRM.'}
                  {role === 'Content Manager' && 'Restricted to homepage CMS, promo banners, collections, and product reviews.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Account Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminUserFormPage;
