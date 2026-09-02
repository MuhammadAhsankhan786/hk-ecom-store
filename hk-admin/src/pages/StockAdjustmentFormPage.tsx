import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, Box, RefreshCw, AlertTriangle } from 'lucide-react';
import type { InventoryAdjustment } from '../types/admin';

export const StockAdjustmentFormPage: React.FC = () => {
  const { setCurrentTab, products, adjustStock, selectedEntityId } = useAdmin();

  const [productId, setProductId] = useState(selectedEntityId || products[0]?.id || '');
  const [adjustment, setAdjustment] = useState<number>(10);
  const [type, setType] = useState<InventoryAdjustment['type']>('Restock');
  const [reason, setReason] = useState('Received shipment PO from Faisalabad textile mill');
  const [notes, setNotes] = useState('');

  const selectedProduct = products.find(p => p.id === productId);

  const currentStock = selectedProduct?.stock || 0;
  const newCalculatedStock = Math.max(0, currentStock + adjustment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    adjustStock(productId, adjustment, type, reason, notes);
    setCurrentTab('inventory');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('inventory')}
            className="p-2 bg-white border border-[#E8E5DE] rounded-xl text-[#111111] hover:bg-[#F8F7F3] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111111]">New Stock Adjustment Entry</h1>
            <p className="text-xs text-[#6B6B6B]">Record physical stock overrides, purchase orders & damages</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCurrentTab('inventory')}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSubmit} icon={<Save className="w-3.5 h-3.5" />}>
            Confirm Stock Adjustment
          </Button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-[#D4AF37]" />
              <span>Target Product Selection</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Select Product *</label>
                <select
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold text-[#111111]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku} | Current Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="p-4 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] flex items-center gap-4">
                  <img
                    src={selectedProduct.images[0]?.url || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E8E5DE]"
                  />
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-[#111111]">{selectedProduct.name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">SKU: {selectedProduct.sku} | Category: {selectedProduct.category}</p>
                    <p className="text-xs font-extrabold text-[#D4AF37]">
                      Price: PKR {selectedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              Adjustment Parameters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">Adjustment Reason Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                  >
                    <option value="Restock">Restock (Purchase Order Received)</option>
                    <option value="Customer Return">Customer Return</option>
                    <option value="Audit Correction">Audit Correction</option>
                    <option value="Damage">Damage / Defect Write-off</option>
                    <option value="Purchase Order">Purchase Order Direct</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#111111] mb-1">Quantity (+ Add or - Deduct)</label>
                  <input
                    type="number"
                    required
                    value={adjustment}
                    onChange={e => setAdjustment(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Primary Reason Description *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Received PO #2026-AUG-44 from Faisalabad factory"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Additional Internal Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Optional notes for audit trail..."
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span>Stock Result Preview</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] flex justify-between items-center">
                <span className="text-[#6B6B6B]">Previous Stock:</span>
                <span className="font-bold text-[#111111]">{currentStock} units</span>
              </div>

              <div className="p-3 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] flex justify-between items-center">
                <span className="text-[#6B6B6B]">Adjustment:</span>
                <span className={`font-bold ${adjustment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {adjustment >= 0 ? `+${adjustment}` : adjustment} units
                </span>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#111111] to-[#222222] text-white rounded-xl border border-gray-800 flex justify-between items-center">
                <span className="font-semibold text-xs">New Total Stock:</span>
                <span className="text-lg font-extrabold text-[#D4AF37]">{newCalculatedStock} units</span>
              </div>

              {newCalculatedStock <= (selectedProduct?.lowStockThreshold || 5) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Warning: Stock will remain at or below low stock threshold.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StockAdjustmentFormPage;
