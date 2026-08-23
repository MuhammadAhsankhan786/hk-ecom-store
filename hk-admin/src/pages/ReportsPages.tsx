import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import KPICard from '../components/ui/KPICard';
import { Download, BarChart3, TrendingUp, ShoppingBag } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { orders, products, customers } = useAdmin();
  const [activeReportTab, setActiveReportTab] = useState<'sales' | 'inventory' | 'customer'>('sales');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = Math.round(totalRevenue / (orders.length || 1));

  const handleExportCSV = () => {
    alert(`Downloading ${activeReportTab.toUpperCase()}_REPORT_2026.csv dataset...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Business Analytics & Reports</h2>
          <p className="text-xs text-[#6B6B6B]">Exportable performance reports for HK Fabric enterprise operation</p>
        </div>
        <Button variant="gold" onClick={handleExportCSV} icon={<Download className="w-4 h-4" />}>
          Export CSV Report
        </Button>
      </div>

      {/* Report Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E8E5DE] pb-2">
        <button
          onClick={() => setActiveReportTab('sales')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'sales' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:bg-[#F8F7F3]'
          }`}
        >
          Sales & Revenue Report
        </button>
        <button
          onClick={() => setActiveReportTab('inventory')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'inventory' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:bg-[#F8F7F3]'
          }`}
        >
          Inventory Movement Report
        </button>
        <button
          onClick={() => setActiveReportTab('customer')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'customer' ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:bg-[#F8F7F3]'
          }`}
        >
          Customer Acquisition Report
        </button>
      </div>

      {/* Report Content */}
      {activeReportTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard title="Total Sales Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} isGoldHighlight={true} />
            <KPICard title="Average Order Value" value={`PKR ${avgOrderValue.toLocaleString()}`} icon={<ShoppingBag className="w-5 h-5 text-indigo-600" />} />
            <KPICard title="Successful Payments" value="100%" subtitle="Easypaisa Verified" icon={<BarChart3 className="w-5 h-5 text-emerald-600" />} />
          </div>

          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Revenue Breakdown by City</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#F8F7F3] rounded-lg border border-[#E8E5DE]">
                <span className="font-bold text-[#111111]">Lahore (Punjab)</span>
                <span className="font-bold text-[#D4AF37]">PKR 1,120,000 (45%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8F7F3] rounded-lg border border-[#E8E5DE]">
                <span className="font-bold text-[#111111]">Karachi (Sindh)</span>
                <span className="font-bold text-[#D4AF37]">PKR 840,000 (34%)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8F7F3] rounded-lg border border-[#E8E5DE]">
                <span className="font-bold text-[#111111]">Islamabad / Rawalpindi</span>
                <span className="font-bold text-[#D4AF37]">PKR 520,000 (21%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReportTab === 'inventory' && (
        <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#111111]">Stock Valuation & Turnover</h3>
          <div className="divide-y divide-[#E8E5DE] text-xs">
            {products.map(p => (
              <div key={p.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-bold text-[#111111]">{p.name}</p>
                  <p className="text-[10px] text-[#6B6B6B]">SKU: {p.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#111111]">{p.stock} units in stock</p>
                  <p className="text-[#D4AF37]">Asset Value: PKR {(p.stock * p.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeReportTab === 'customer' && (
        <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#111111]">Top Spending Customers (LTV)</h3>
          <div className="divide-y divide-[#E8E5DE] text-xs">
            {customers.map(c => (
              <div key={c.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-bold text-[#111111]">{c.name}</p>
                  <p className="text-[10px] text-[#6B6B6B]">{c.email} • {c.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#D4AF37]">PKR {c.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-[#6B6B6B]">{c.ordersCount} total orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
