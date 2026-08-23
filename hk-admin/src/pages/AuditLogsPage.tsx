import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { AuditLog } from '../types/admin';
import { CheckCircle } from 'lucide-react';

// AUDIT LOGS PAGE
export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useAdmin();

  const columns: Column<AuditLog>[] = [
    { key: 'timestamp', header: 'Timestamp', sortable: true },
    {
      key: 'user',
      header: 'Staff User',
      render: (log) => <span className="font-bold text-[#111111]">{log.user}</span>
    },
    {
      key: 'action',
      header: 'Action Description',
      render: (log) => <span className="font-semibold text-[#D4AF37]">{log.action}</span>
    },
    { key: 'entity', header: 'Module Entity', render: (log) => <Badge variant="gold">{log.entity}</Badge> },
    { key: 'entityId', header: 'Entity ID / SKU' },
    {
      key: 'diff',
      header: 'Change Diff',
      render: (log) => (
        <div className="text-[11px]">
          {log.previousValue && <span className="line-through text-rose-500 mr-2">{log.previousValue}</span>}
          {log.newValue && <span className="text-emerald-600 font-bold">{log.newValue}</span>}
        </div>
      )
    },
    { key: 'ipAddress', header: 'IP Location' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Enterprise Audit Logs</h2>
        <p className="text-xs text-[#6B6B6B]">Immutable operational log of all staff actions, price updates, and stock edits</p>
      </div>

      <DataTable data={auditLogs} columns={columns} searchPlaceholder="Search audit log action, staff, entity..." />
    </div>
  );
};

// STORE SETTINGS PAGE
export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const s = settings[0];

  const [storeName, setStoreName] = useState(s?.storeName || 'HK Fabric');
  const [email, setEmail] = useState(s?.contactEmail || 'support@hkfabric.pk');
  const [phone, setPhone] = useState(s?.contactPhone || '+92 42 35789000');
  const [address, setAddress] = useState(s?.storeAddress || '');
  const [shippingFee, setShippingFee] = useState(s?.defaultShippingFee || 250);
  const [freeThreshold, setFreeThreshold] = useState(s?.freeShippingThreshold || 5000);
  const [easypaisaMerchant, setEasypaisaMerchant] = useState(s?.easypaisaMerchantId || 'HK_FABRIC_882');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      contactEmail: email,
      contactPhone: phone,
      storeAddress: address,
      defaultShippingFee: Number(shippingFee),
      freeShippingThreshold: Number(freeThreshold),
      easypaisaMerchantId: easypaisaMerchant
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Store & Operation Settings</h2>
          <p className="text-xs text-[#6B6B6B]">Store profile, shipping rates, and Easypaisa integration config</p>
        </div>
        <Button variant="gold" type="submit" icon={<CheckCircle className="w-4 h-4" />}>
          Save All Settings
        </Button>
      </div>

      {/* Store Identity */}
      <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Store General Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-[#111111] mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#111111] mb-1">Support Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#111111] mb-1">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#111111] mb-1">Head Office Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>
        </div>
      </div>

      {/* Shipping & Delivery Charges */}
      <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Pakistan Delivery & Shipping Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-[#111111] mb-1">Default Standard Shipping Fee (PKR)</label>
            <input
              type="number"
              value={shippingFee}
              onChange={e => setShippingFee(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#111111] mb-1">Free Shipping Threshold (PKR)</label>
            <input
              type="number"
              value={freeThreshold}
              onChange={e => setFreeThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3] font-bold text-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Easypaisa Payment Credentials Configuration (Masked) */}
      <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Easypaisa Merchant Credentials</h3>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#111111] mb-1">Easypaisa Merchant ID</label>
            <input
              type="text"
              value={easypaisaMerchant}
              onChange={e => setEasypaisaMerchant(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3] font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-[#111111] mb-1">Easypaisa Hash Secret Key (Masked for Security)</label>
            <input
              type="password"
              readOnly
              value="••••••••••••••••984A"
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-gray-100 text-gray-500 font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
