import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { Coupon } from '../types/admin';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const CouponsPage: React.FC = () => {
  const { coupons, setCurrentTab, setSelectedEntityId, toggleCouponStatus, deleteCoupon } = useAdmin();
  const [activeTab, setActiveTab] = useState('all');

  const handleCreate = () => {
    setSelectedEntityId(null);
    setCurrentTab('create-coupon');
  };

  const handleEdit = (id: string) => {
    setSelectedEntityId(id);
    setCurrentTab('edit-coupon');
  };

  const filteredCoupons = coupons.filter(c => {
    if (activeTab === 'active') return c.status === 'Active';
    if (activeTab === 'expired') return c.status === 'Expired';
    if (activeTab === 'disabled') return c.status === 'Disabled';
    return true;
  });

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Coupon Code',
      render: (c) => (
        <span className="font-mono font-bold text-sm text-[#111111] bg-[#FDF9EC] px-2.5 py-1 rounded-md border border-[#F5E6B3]">
          {c.code}
        </span>
      )
    },
    {
      key: 'value',
      header: 'Discount Value',
      render: (c) => (
        <span className="font-bold text-[#D4AF37]">
          {c.type === 'percentage' ? `${c.value}% OFF` : `PKR ${c.value.toLocaleString()} OFF`}
        </span>
      )
    },
    { key: 'minOrderValue', header: 'Min Order', render: (c) => `PKR ${c.minOrderValue.toLocaleString()}` },
    { key: 'usedCount', header: 'Usage', render: (c) => `${c.usedCount} / ${c.usageLimit}` },
    { key: 'expiryDate', header: 'Expiry Date' },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <Badge variant={c.status === 'Active' ? 'gold' : 'gray'}>{c.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(c.id)} icon={<Edit className="w-3.5 h-3.5" />}>
            Edit Form
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleCouponStatus(c.id)}>
            {c.status === 'Active' ? 'Disable' : 'Enable'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteCoupon(c.id)} icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Coupons & Promotional Discounts</h2>
          <p className="text-xs text-[#6B6B6B]">Create promotional discount codes and order minimum rules</p>
        </div>
        <Button variant="gold" onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
          Add Coupon Form
        </Button>
      </div>

      <DataTable
        data={filteredCoupons}
        columns={columns}
        searchPlaceholder="Search coupon code..."
        filterTabs={[
          { id: 'all', label: 'All Coupons', count: coupons.length },
          { id: 'active', label: 'Active', count: coupons.filter(c => c.status === 'Active').length },
          { id: 'expired', label: 'Expired', count: coupons.filter(c => c.status === 'Expired').length }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};
