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
    if (activeTab === 'pending-payment') return ord.orderStatus === 'Pending Payment';
    if (activeTab === 'paid') return ord.orderStatus === 'Paid';
    if (activeTab === 'processing') return ord.orderStatus === 'Processing';
    if (activeTab === 'packed') return ord.orderStatus === 'Packed';
    if (activeTab === 'shipped') return ord.orderStatus === 'Shipped';
    if (activeTab === 'delivered') return ord.orderStatus === 'Delivered';
    if (activeTab === 'cancelled') return ord.orderStatus === 'Cancelled';
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
      key: 'items',
      header: 'Items',
      render: (ord) => `${ord.items.reduce((s, i) => s + i.quantity, 0)} Items`
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: (ord) => (
        <span className="font-bold text-[#111111]">PKR {ord.total.toLocaleString()}</span>
      )
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (ord) => (
        <Badge variant={ord.paymentStatus === 'Successful' ? 'success' : 'warning'}>
          {ord.paymentMethod}
        </Badge>
      )
    },
    {
      key: 'orderStatus',
      header: 'Order Status',
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
          View Order
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Order Management</h2>
          <p className="text-xs text-[#6B6B6B]">Filter, inspect and manage customer order fulfillment</p>
        </div>
      </div>

      <DataTable
        data={filteredOrders}
        columns={columns}
        searchPlaceholder="Search order ID, customer name, phone..."
        filterTabs={[
          { id: 'all', label: 'All Orders', count: orders.length },
          { id: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'Processing').length },
          { id: 'packed', label: 'Packed', count: orders.filter(o => o.orderStatus === 'Packed').length },
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
  const { orders, selectedEntityId, setCurrentTab, updateOrderStatus } = useAdmin();
  const order = orders.find(o => o.id === selectedEntityId) || orders[0];

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus);
  const [statusNote, setStatusNote] = useState('');

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, selectedStatus, statusNote || `Status updated to ${selectedStatus}`);
  };

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
                <span>Total Amount Paid</span>
                <span className="text-[#D4AF37]">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Easypaisa Payment Information */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Payment Details</h3>
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800">Method: {order.paymentMethod}</span>
                <Badge variant={order.paymentStatus === 'Successful' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.easypaisaTxnId && (
                <div className="pt-2 border-t border-emerald-200/60 font-mono text-[11px] text-emerald-900">
                  Easypaisa Transaction Ref: <span className="font-bold">{order.easypaisaTxnId}</span>
                </div>
              )}
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
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Paid">Paid</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
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
                  placeholder="e.g. Leopard Courier Tracking #LPD-8821"
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
    </div>
  );
};
