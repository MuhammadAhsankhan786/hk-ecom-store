import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import type { Customer } from '../types/admin';
import { Eye } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers } = useAdmin();
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer Name',
      render: (c) => (
        <div>
          <button onClick={() => setSelectedCust(c)} className="font-bold text-[#111111] hover:text-[#D4AF37] cursor-pointer">
            {c.name}
          </button>
          <p className="text-[10px] text-[#6B6B6B]">{c.email}</p>
        </div>
      )
    },
    { key: 'phone', header: 'Phone Number' },
    { key: 'city', header: 'City', sortable: true },
    { key: 'ordersCount', header: 'Orders', sortable: true, render: (c) => `${c.ordersCount} Orders` },
    {
      key: 'totalSpent',
      header: 'Total Spent (LTV)',
      sortable: true,
      render: (c) => <span className="font-bold text-[#D4AF37]">PKR {c.totalSpent.toLocaleString()}</span>
    },
    { key: 'lastOrderDate', header: 'Last Order' },
    {
      key: 'status',
      header: 'Account Status',
      render: (c) => <Badge variant={c.status === 'Active' ? 'success' : 'danger'}>{c.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedCust(c)} icon={<Eye className="w-3.5 h-3.5" />}>
          Profile
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Customer Directory & CRM</h2>
        <p className="text-xs text-[#6B6B6B]">Lifetime value metrics, purchase history, and customer profile details</p>
      </div>

      <DataTable data={customers} columns={columns} searchPlaceholder="Search customer name, email, phone..." />

      {/* Customer Details Profile Drawer */}
      <Drawer
        isOpen={selectedCust !== null}
        onClose={() => setSelectedCust(null)}
        title="Customer CRM Profile"
        width="lg"
      >
        {selectedCust && (
          <div className="space-y-6 text-xs">
            {/* Header profile card */}
            <div className="p-4 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-base border border-[#D4AF37]">
                {selectedCust.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#111111]">{selectedCust.name}</h3>
                <p className="text-[#6B6B6B]">{selectedCust.email} • {selectedCust.phone}</p>
                <p className="text-[10px] text-[#D4AF37] font-semibold mt-0.5">Joined: {selectedCust.createdAt}</p>
              </div>
            </div>

            {/* LTV & Orders Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white border border-[#E8E5DE] rounded-xl">
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase">Total Orders</p>
                <p className="text-lg font-bold text-[#111111]">{selectedCust.ordersCount}</p>
              </div>
              <div className="p-3 bg-white border border-[#E8E5DE] rounded-xl">
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase">Total Lifetime Spend</p>
                <p className="text-lg font-bold text-[#D4AF37]">PKR {selectedCust.totalSpent.toLocaleString()}</p>
              </div>
            </div>

            {/* Address Book */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#111111] uppercase tracking-wider">Saved Delivery Addresses</h4>
              {selectedCust.addresses.map((addr, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#E8E5DE] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111111]">{addr.title}</span>
                    {addr.isDefault && <Badge variant="gold">Default</Badge>}
                  </div>
                  <p className="text-[#6B6B6B]">{addr.address}, {addr.city}, {addr.province}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
