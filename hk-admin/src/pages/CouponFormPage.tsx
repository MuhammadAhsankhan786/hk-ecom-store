import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, Calendar, Tag } from 'lucide-react';

export const CouponFormPage: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const { setCurrentTab, coupons, addCoupon, updateCoupon, selectedEntityId } = useAdmin();

  const existingCoupon = isEdit ? coupons.find(c => c.id === selectedEntityId) : undefined;

  const [code, setCode] = useState(existingCoupon?.code || '');
  const [type, setType] = useState<'percentage' | 'fixed'>(existingCoupon?.type || 'percentage');
  const [value, setValue] = useState(existingCoupon?.value || 10);
  const [minOrderValue, setMinOrderValue] = useState(existingCoupon?.minOrderValue || 5000);
  const [maxDiscount, setMaxDiscount] = useState(existingCoupon?.maxDiscount || 2000);
  const [startDate, setStartDate] = useState(existingCoupon?.startDate || '2026-08-01');
  const [expiryDate, setExpiryDate] = useState(existingCoupon?.expiryDate || '2026-12-31');
  const [usageLimit, setUsageLimit] = useState(existingCoupon?.usageLimit || 500);
  const [perCustomerLimit, setPerCustomerLimit] = useState(existingCoupon?.perCustomerLimit || 1);
  const [status, setStatus] = useState<'Active' | 'Scheduled' | 'Disabled'>(existingCoupon?.status as any || 'Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = code.toUpperCase().trim();

    if (isEdit && selectedEntityId) {
      updateCoupon(selectedEntityId, {
        code: formattedCode, type, value, minOrderValue, maxDiscount,
        startDate, expiryDate, usageLimit, perCustomerLimit, status
      });
    } else {
      addCoupon({
        code: formattedCode, type, value, minOrderValue, maxDiscount,
        startDate, expiryDate, usageLimit, perCustomerLimit, status
      });
    }
    setCurrentTab('coupons');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('coupons')}
            className="p-2 bg-white border border-[#E8E5DE] rounded-xl text-[#111111] hover:bg-[#F8F7F3] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111111]">
              {isEdit ? 'Edit Discount Coupon' : 'Create New Coupon'}
            </h1>
            <p className="text-xs text-[#6B6B6B]">Configure percentage % or fixed PKR discount vouchers</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCurrentTab('coupons')}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSubmit} icon={<Save className="w-3.5 h-3.5" />}>
            {isEdit ? 'Save Changes' : 'Activate Coupon'}
          </Button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
              <span>Coupon Code & Discount Type</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AZADI2026, WELCOME10"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-sm font-mono font-bold tracking-wider text-[#111111] uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Fixed Amount Off (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    {type === 'percentage' ? 'Percentage Value (%)' : 'Fixed Discount Value (PKR)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">Min Order Requirement (PKR)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={e => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-semibold"
                  />
                </div>

                {type === 'percentage' && (
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">Max Discount Cap (PKR)</label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={e => setMaxDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-semibold"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Validity & Usage Restrictions</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Global Total Usage Limit</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={e => setUsageLimit(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Limit Per Customer</label>
                <input
                  type="number"
                  value={perCustomerLimit}
                  onChange={e => setPerCustomerLimit(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              Status & Activation
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Coupon Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                >
                  <option value="Active">Active (Ready for Use)</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Live Voucher Preview Card */}
            <div className="p-4 bg-gradient-to-br from-[#111111] to-[#222222] text-white rounded-xl border border-gray-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-extrabold text-[#D4AF37] tracking-wider uppercase">
                  {code || 'COUPONCODE'}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-[#D4AF37] text-black rounded-full uppercase">
                  {type === 'percentage' ? `${value}% OFF` : `PKR ${value} OFF`}
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Min. order PKR {minOrderValue.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">
                Valid until: {expiryDate}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CouponFormPage;
