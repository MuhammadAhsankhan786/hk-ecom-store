import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { StatusTimeline } from '../components/ui/StatusTimeline';
import type { Order, OrderStatus } from '../types/admin';
import { Eye, ArrowLeft, Printer } from 'lucide-react';

// ORDERS LIST PAGE
export const OrdersListPage: React.FC = () => {
  const { orders, setCurrentTab, setSelectedEntityId } = useAdmin();
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = orders.filter(ord => {
    if (activeTab === 'pending-advance') return ord.advancePaymentStatus === 'PENDING';
    if (activeTab === 'verified-advance') return ord.advancePaymentStatus === 'VERIFIED';
    if (activeTab === 'processing') return ord.orderStatus === 'Processing';
    if (activeTab === 'shipped') return ord.orderStatus === 'Shipped';
    if (activeTab === 'delivered') return ord.orderStatus === 'Delivered';
    return true;
  });

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      render: (ord) => (
        <div>
          <button
            onClick={() => { setSelectedEntityId(ord.id); setCurrentTab('order-details'); }}
            className="font-bold text-[#111111] hover:text-[#D4AF37] cursor-pointer"
          >
            {ord.orderNumber}
          </button>
          <p className="text-[10px] text-[#6B6B6B]">{ord.createdAt}</p>
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (ord) => (
        <div>
          <p className="font-bold text-[#111111]">{ord.customerName}</p>
          <p className="text-[10px] text-[#6B6B6B]">{ord.customerPhone} • {ord.shippingAddress.city}</p>
        </div>
      )
    },
    {
      key: 'total',
      header: 'Financials (Total / Advance / COD)',
      sortable: true,
      render: (ord) => (
        <div>
          <p className="font-bold text-[#111111]">Total: PKR {ord.total.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">Advance Paid: PKR {(ord.advancePaymentAmount || 1000).toLocaleString()}</p>
          <p className="text-[10px] text-amber-700 font-semibold">Remaining COD: PKR {(ord.remainingCodAmount || Math.max(0, ord.total - 1000)).toLocaleString()}</p>
        </div>
      )
    },
    {
      key: 'paymentStatus',
      header: 'Advance Receipt Status',
      render: (ord) => {
        const advStatus = ord.advancePaymentStatus || (ord.paymentScreenshot ? 'PENDING' : 'UNPAID');
        return (
          <div className="space-y-1">
            <Badge
              variant={
                advStatus === 'VERIFIED' ? 'success' :
                advStatus === 'REJECTED' ? 'danger' : 'warning'
              }
            >
              {advStatus === 'VERIFIED' ? '✓ PKR 1,000 Verified' : advStatus === 'REJECTED' ? '✗ Receipt Rejected' : '⏱ Advance Pending'}
            </Badge>
            {ord.paymentScreenshot && (
              <p className="text-[9px] text-blue-600 font-bold underline cursor-pointer" onClick={() => { setSelectedEntityId(ord.id); setCurrentTab('order-details'); }}>
                📷 Receipt Uploaded
              </p>
            )}
          </div>
        );
      }
    },
    {
      key: 'orderStatus',
      header: 'Fulfillment Status',
      render: (ord) => (
        <Badge
          variant={
            ord.orderStatus === 'Delivered' ? 'success' :
            ord.orderStatus === 'Shipped' ? 'info' :
            ord.orderStatus === 'Processing' ? 'warning' : 'gray'
          }
        >
          {ord.orderStatus}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (ord) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setSelectedEntityId(ord.id); setCurrentTab('order-details'); }}
          icon={<Eye className="w-3.5 h-3.5" />}
        >
          Inspect Order
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Order & Advance COD Management</h2>
          <p className="text-xs text-[#6B6B6B]">Inspect PKR 1,000 advance payment receipts, verify bank deposits & manage Cash on Delivery</p>
        </div>
      </div>

      <DataTable
        data={filteredOrders}
        columns={columns}
        searchPlaceholder="Search order ID, customer name, phone..."
        filterTabs={[
          { id: 'all', label: 'All Orders', count: orders.length },
          { id: 'pending-advance', label: 'Pending Receipts', count: orders.filter(o => o.advancePaymentStatus === 'PENDING').length },
          { id: 'verified-advance', label: 'Verified Advance', count: orders.filter(o => o.advancePaymentStatus === 'VERIFIED').length },
          { id: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'Processing').length },
          { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length },
          { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'Delivered').length }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

// ORDER DETAILS PAGE
export const OrderDetailsPage: React.FC = () => {
  const { orders, selectedEntityId, setCurrentTab, updateOrderStatus, verifyAdvancePayment } = useAdmin();
  const order = orders.find(o => o.id === selectedEntityId) || orders[0];

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus);
  const [statusNote, setStatusNote] = useState('');
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOrderStatus(order.id, selectedStatus, statusNote || `Status updated to ${selectedStatus}`);
  };

  const advanceAmt = order.advancePaymentAmount || 1000;
  const remainingCod = order.remainingCodAmount || Math.max(0, order.total - advanceAmt);
  const advStatus = order.advancePaymentStatus || (order.paymentScreenshot ? 'PENDING' : 'UNPAID');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentTab('orders')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Orders
          </Button>
          <h2 className="text-xl font-bold text-[#111111]">Order: {order.orderNumber}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Printing official tax invoice for ${order.orderNumber}...`)}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADVANCE PAYMENT & RECEIPT VERIFICATION CARD (User's Core Requirement) */}
          <div className="bg-white border-2 border-[#D4AF37]/50 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E5DE] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">
                  PKR 1,000 Advance Payment Proof & COD Verification
                </h3>
                <p className="text-[11px] text-[#6B6B6B]">Customer submitted advance deposit receipt screenshot via Easypaisa / Bank Transfer</p>
              </div>
              <Badge
                variant={
                  advStatus === 'VERIFIED' ? 'success' :
                  advStatus === 'REJECTED' ? 'danger' : 'warning'
                }
              >
                {advStatus === 'VERIFIED' ? '✓ VERIFIED' : advStatus === 'REJECTED' ? 'REJECTED' : 'PENDING VERIFICATION'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Receipt Image Thumbnail */}
              <div>
                <p className="text-xs font-bold text-[#111111] mb-2">Deposit Receipt Screenshot:</p>
                {order.paymentScreenshot ? (
                  <div
                    onClick={() => setShowScreenshotModal(true)}
                    className="group relative w-full h-40 rounded-xl overflow-hidden border border-[#E8E5DE] bg-black/5 cursor-pointer shadow-xs hover:shadow-md transition-shadow"
                  >
                    <img src={order.paymentScreenshot} alt="Payment Receipt" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Eye className="w-4 h-4" /> Click to Zoom Screenshot
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#F8F7F3] rounded-xl border border-dashed border-[#E8E5DE] text-center text-xs text-gray-500">
                    No receipt screenshot uploaded by customer.
                  </div>
                )}
              </div>

              {/* Action Buttons & Financial Breakdown */}
              <div className="space-y-3 bg-[#DFDBCF]/30 p-4 rounded-xl border border-[#E8E5DE] text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Order Total:</span>
                    <span className="font-bold text-[#111111]">PKR {order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Advance Required:</span>
                    <span>PKR {advanceAmt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold pt-1 border-t border-[#E8E5DE]">
                    <span>Remaining COD to Collect:</span>
                    <span>PKR {remainingCod.toLocaleString()}</span>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => verifyAdvancePayment(order.id, 'VERIFIED', 'Admin verified PKR 1,000 in bank statement')}
                    disabled={advStatus === 'VERIFIED'}
                    className="w-full justify-center"
                  >
                    ✓ Confirm & Verify PKR 1,000 Advance
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => verifyAdvancePayment(order.id, 'REJECTED', 'Admin checked bank statement but payment was not received')}
                    disabled={advStatus === 'REJECTED'}
                    className="w-full justify-center text-rose-600 hover:bg-rose-50"
                  >
                    ✗ Reject Payment Receipt
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Ordered Products</h3>

            <div className="divide-y divide-[#E8E5DE]">
              {order.items.map((item, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-[#E8E5DE]" />
                    <div>
                      <p className="font-bold text-xs text-[#111111]">{item.productName}</p>
                      <p className="text-[10px] text-[#6B6B6B]">Variant: {item.variant} | SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xs text-[#111111]">PKR {item.price.toLocaleString()} x {item.quantity}</p>
                    <p className="text-xs font-bold text-[#D4AF37]">PKR {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Subtotal</span>
                <span>PKR {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Shipping Fee</span>
                <span>PKR {order.shippingFee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>- PKR {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E8E5DE]">
                <span>Total Order Amount</span>
                <span className="text-[#D4AF37]">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Timeline History */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Order Lifecycle Timeline</h3>
            <StatusTimeline timeline={order.timeline} />
          </div>
        </div>

        {/* Right Column (1 Col): Customer & Status Modifier */}
        <div className="space-y-6">
          {/* Modify Order Status Form */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Update Order Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Status Step</label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                >
                  <option value="Processing">Processing (Order Confirmed)</option>
                  <option value="Packed">Packed (Ready for Dispatch)</option>
                  <option value="Shipped">Shipped (Dispatched to Courier)</option>
                  <option value="Delivered">Delivered (Handed to Customer)</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>

                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Fulfillment Note</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="e.g. Verified PKR 1,000 payment & dispatched via TCS #TCS-8812"
                  className="w-full px-3 py-2 border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                />
              </div>

              <Button variant="gold" size="sm" type="submit" className="w-full">
                Apply Status Change
              </Button>
            </form>
          </div>

          {/* Customer Address Details */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Customer Shipping</h3>
            <div className="space-y-1">
              <p className="font-bold text-[#111111] text-sm">{order.customerName}</p>
              <p className="text-[#6B6B6B]">{order.customerEmail}</p>
              <p className="text-[#6B6B6B]">{order.customerPhone}</p>
            </div>
            <div className="p-3 bg-[#F8F7F3] rounded-lg border border-[#E8E5DE]">
              <p className="font-semibold text-[#111111]">{order.shippingAddress.address}</p>
              <p className="text-[#6B6B6B]">{order.shippingAddress.city}, {order.shippingAddress.province} ({order.shippingAddress.postalCode})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Receipt Screenshot Modal */}
      {showScreenshotModal && order.paymentScreenshot && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowScreenshotModal(false)}>
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-[#E8E5DE]">
              <h4 className="font-bold text-sm text-[#111111]">Advance Payment Proof — Order #{order.orderNumber}</h4>
              <button onClick={() => setShowScreenshotModal(false)} className="text-gray-500 hover:text-black font-bold text-lg px-2">✕</button>
            </div>
            <div className="p-2 max-h-[80vh] overflow-auto flex justify-center bg-gray-100">
              <img src={order.paymentScreenshot} alt="Full Receipt" className="max-w-full h-auto rounded-lg shadow" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
