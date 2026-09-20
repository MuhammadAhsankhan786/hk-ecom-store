'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getApiBaseUrl } from '../../src/services/api'

interface OrderDetails {
  id: string
  orderNumber: string
  totalAmount: number
  advancePaymentAmount: number
  remainingCodAmount: number
  paymentScreenshot?: string | null
  advancePaymentStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED'
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  createdAt: string
  items: Array<{
    id: string
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const queryOrderNumber = searchParams?.get('orderNumber') || ''
  const queryOrderId = searchParams?.get('orderId') || ''

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const targetId = queryOrderId || queryOrderNumber
    if (targetId) {
      fetch(`${getApiBaseUrl()}/orders/${targetId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Order not found')
          return res.json()
        })
        .then((data) => {
          setOrder(data)
        })
        .catch((err) => {
          setError(err.message || 'Failed to load order details')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [queryOrderNumber, queryOrderId])

  return (
    <div className="bg-white max-w-2xl w-full p-6 sm:p-10 shadow-sm border border-[#E8E5DE] text-center rounded-sm">
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <svg className="animate-spin text-[#D4AF37] mb-4" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeOpacity=".3" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
          <p className="text-sm font-semibold text-[#111111]">Loading Order Confirmation Details…</p>
        </div>
      ) : error || !order ? (
        <div className="py-10">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-2">HK Fabric Store</p>
          <h1 className="font-serif text-3xl font-medium text-[#111111] mb-2">Order Placed Successfully!</h1>
          <p className="text-sm text-[#6B6B6B] mb-6">
            Thank you for shopping with HK Fabric! Order ID: <span className="font-semibold text-[#111111]">{queryOrderNumber || queryOrderId || 'HK Order'}</span>
          </p>
          <div className="p-4 bg-[#F8F7F3] rounded text-xs text-left mb-6 space-y-1.5 border border-[#E8E5DE]">
            <p className="font-semibold text-[#111111] flex items-center gap-1.5">
              <span>💳 Payment Method:</span> Cash on Delivery + PKR 1,000 Advance Deposit
            </p>
            <p className="text-[#6B6B6B]">
              Our support team is reviewing your deposit receipt screenshot. Once verified, your parcel will be dispatched!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="btn-gold flex-1 py-3.5 text-[10px] uppercase tracking-widest">
              Continue Shopping
            </Link>
            <Link href="/account" className="btn-dark flex-1 py-3.5 text-[10px] uppercase tracking-widest">
              View Order History
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Header Banner */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1">HK Fabric Luxury Store</p>
          <h1 className="font-serif text-3xl font-medium text-[#111111] mb-2">
            Order #{order.orderNumber} Confirmed!
          </h1>
          <p className="text-sm text-[#6B6B6B] mb-6">
            Thank you <span className="font-semibold text-[#111111]">{order.customerName}</span>! We have received your order details and advance payment receipt.
          </p>

          {/* Advance Verification Banner */}
          <div className={`p-4 mb-6 rounded text-left border text-xs ${
            order.advancePaymentStatus === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : order.advancePaymentStatus === 'REJECTED'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="flex items-center gap-1.5">
                {order.advancePaymentStatus === 'VERIFIED' ? '✅ PKR 1,000 Advance Verified' : order.advancePaymentStatus === 'REJECTED' ? '⚠️ Advance Deposit Receipt Rejected' : '⏳ PKR 1,000 Advance Verification Pending'}
              </span>
              <span className="uppercase text-[10px] px-2 py-0.5 rounded font-mono bg-white bg-opacity-70 border border-current">
                {order.advancePaymentStatus || 'PENDING'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {order.advancePaymentStatus === 'VERIFIED'
                ? 'Your PKR 1,000 advance payment receipt has been verified by our store manager! Your order is currently being packed for dispatch.'
                : order.advancePaymentStatus === 'REJECTED'
                ? 'Our team could not verify your receipt screenshot. Please contact customer support via WhatsApp or email with your payment transaction ID.'
                : 'Our team is reviewing your uploaded Easypaisa / Bank Transfer screenshot. Processing takes 15–30 minutes during business hours.'}
            </p>
          </div>

          {/* Financial Breakdown Table */}
          <div className="bg-[#F8F7F3] p-5 text-left mb-6 border border-[#E8E5DE] space-y-2.5 rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E8E5DE] pb-2 mb-3">
              Order Payment Breakdown
            </h3>
            <div className="flex justify-between text-xs text-[#6B6B6B]">
              <span>Total Order Value:</span>
              <span className="font-semibold text-[#111111]">PKR {order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-amber-700 bg-amber-50/60 p-2 rounded">
              <span>Advance Paid (Easypaisa/Bank):</span>
              <span className="font-bold">PKR {(order.advancePaymentAmount || 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-700 bg-emerald-50/60 p-2 rounded">
              <span>Remaining COD Amount (Doorstep):</span>
              <span className="font-bold">PKR {(order.remainingCodAmount || (order.totalAmount - 1000)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-[#6B6B6B] pt-2 border-t border-[#E8E5DE]">
              <span>Delivery Status:</span>
              <span className="font-semibold uppercase text-[#D4AF37]">{order.status}</span>
            </div>
          </div>

          {/* Purchased Items List */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white p-5 text-left mb-8 border border-[#E8E5DE] rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E8E5DE] pb-2 mb-3">
                Items In Order ({order.items.length})
              </h3>
              <div className="divide-y divide-[#E8E5DE]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-[#111111]">{item.productName}</p>
                      <p className="text-[#6B6B6B] text-[11px]">Qty: {item.quantity} × PKR {item.unitPrice.toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-[#111111]">PKR {item.totalPrice.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-[#F8F7F3] p-4 text-left mb-8 border border-[#E8E5DE] text-xs text-[#6B6B6B] space-y-1">
            <p className="font-bold text-[#111111] uppercase tracking-wider text-[10px] mb-1">Shipping Details</p>
            <p className="text-[#111111] font-semibold">{order.customerName} ({order.customerPhone})</p>
            <p>{order.shippingAddress}, {order.shippingCity}</p>
            <p>{order.customerEmail}</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="btn-gold flex-1 py-3.5 text-[10px] uppercase tracking-widest text-center">
              Continue Shopping
            </Link>
            <Link href="/account" className="btn-dark flex-1 py-3.5 text-[10px] uppercase tracking-widest text-center">
              View Order History
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function OrderConfirmation() {
  return (
    <main className="bg-[#F8F7F3] min-h-screen py-12 lg:py-20 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="bg-white max-w-xl w-full p-12 text-center text-sm font-semibold rounded-sm border border-[#E8E5DE]">
          Loading order details…
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </main>
  )
}

