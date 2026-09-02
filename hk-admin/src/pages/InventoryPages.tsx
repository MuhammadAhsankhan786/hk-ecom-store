import React from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { Product, InventoryAdjustment } from '../types/admin';
import { RefreshCw, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { products, setCurrentTab, setSelectedEntityId } = useAdmin();

  const handleOpenAdjustment = (productId?: string) => {
    if (productId) setSelectedEntityId(productId);
    else setSelectedEntityId(null);
    setCurrentTab('create-stock-adjustment');
  };

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Product Name',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]?.url || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-[#E8E5DE]" />
          <div>
            <p className="font-bold text-[#111111]">{p.name}</p>
            <p className="text-[10px] text-[#6B6B6B]">SKU: {p.sku}</p>
          </div>
        </div>
      )
    },
    { key: 'sku', header: 'SKU', sortable: true },
    {
      key: 'stock',
      header: 'Current Stock',
      sortable: true,
      render: (p) => (
        <span className="font-bold text-[#111111] text-sm">{p.stock} units</span>
      )
    },
    {
      key: 'reserved',
      header: 'Reserved Stock',
      render: (p) => <span className="text-[#6B6B6B] font-medium">{p.reservedStock} units</span>
    },
    {
      key: 'available',
      header: 'Available Stock',
      render: (p) => (
        <span className="font-bold text-emerald-600">
          {Math.max(0, p.stock - p.reservedStock)} units
        </span>
      )
    },
    {
      key: 'threshold',
      header: 'Threshold',
      render: (p) => <span className="text-[#6B6B6B]">{p.lowStockThreshold} units</span>
    },
    {
      key: 'status',
      header: 'Stock Status',
      render: (p) => (
        <Badge variant={p.stock <= p.lowStockThreshold ? 'danger' : 'success'}>
          {p.stock <= p.lowStockThreshold ? 'Low Stock' : 'In Stock'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Stock Action',
      className: 'text-right',
      render: (p) => (
        <Button
          variant="gold"
          size="sm"
          onClick={() => handleOpenAdjustment(p.id)}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Adjust Stock Form
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Inventory Control & Stock Adjustments</h2>
          <p className="text-xs text-[#6B6B6B]">Real-time warehouse stock tracking and manual inventory overrides</p>
        </div>
        <Button variant="gold" onClick={() => handleOpenAdjustment()} icon={<Plus className="w-4 h-4" />}>
          New Stock Adjustment Form
        </Button>
      </div>

      <DataTable data={products} columns={columns} searchPlaceholder="Search inventory by product SKU..." />
    </div>
  );
};

// INVENTORY HISTORY LOG PAGE
export const InventoryHistoryPage: React.FC = () => {
  const { inventoryLogs } = useAdmin();

  const columns: Column<InventoryAdjustment>[] = [
    { key: 'createdAt', header: 'Timestamp', sortable: true },
    {
      key: 'productName',
      header: 'Product',
      render: (log) => (
        <div>
          <p className="font-bold text-[#111111]">{log.productName}</p>
          <p className="text-[10px] text-[#6B6B6B]">SKU: {log.sku}</p>
        </div>
      )
    },
    { key: 'type', header: 'Type', render: (log) => <Badge variant="gold">{log.type}</Badge> },
    {
      key: 'previousQuantity',
      header: 'Prev Qty',
      render: (log) => `${log.previousQuantity} units`
    },
    {
      key: 'adjustment',
      header: 'Adjustment',
      render: (log) => (
        <span className={`font-bold flex items-center gap-1 ${log.adjustment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {log.adjustment >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {log.adjustment >= 0 ? `+${log.adjustment}` : log.adjustment}
        </span>
      )
    },
    {
      key: 'newQuantity',
      header: 'New Qty',
      render: (log) => <span className="font-bold text-[#111111]">{log.newQuantity} units</span>
    },
    { key: 'user', header: 'Performed By' },
    { key: 'reason', header: 'Reason Note' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Inventory Movement Log</h2>
        <p className="text-xs text-[#6B6B6B]">Full audit trail of stock adjustments across all warehouses</p>
      </div>

      <DataTable data={inventoryLogs} columns={columns} searchPlaceholder="Search history by SKU, user..." />
    </div>
  );
};
