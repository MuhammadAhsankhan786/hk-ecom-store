'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function OrderConfirmation() {
  const [orderId, setOrderId] = useState('HKF-784920')

  useEffect(() => {
    setOrderId('HKF-' + Math.floor(100000 + Math.random() * 900000))
  }, [])

  return (
    <main className="bg-[#F8F7F3] min-h-screen py-16 lg:py-24 flex items-center justify-center px-4">
      <div className="bg-white max-w-xl w-full p-8 lg:p-12 shadow-sm border border-[#E8E5DE] text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-2">Thank you for your order</p>
        <h1 className="font-serif text-3xl font-500 text-[#111111] mb-2">Order Confirmed!</h1>
        <p className="text-sm text-[#6B6B6B] mb-6">
          We have received your order and are getting it ready for dispatch.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#F8F7F3] p-5 text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-[#6B6B6B]">Order Number:</span>
            <span className="font-semibold text-[#111111]">{orderId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6B6B6B]">Payment Method:</span>
            <span className="font-semibold text-[#111111]">Easypaisa Online</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6B6B6B]">Payment Status:</span>
            <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5">Paid</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#6B6B6B]">Estimated Delivery:</span>
            <span className="font-semibold text-[#111111]">3–5 Business Days</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-4 text-left">What happens next?</p>
          <div className="space-y-4 text-left">
            {[
              ['1. Order Confirmed', 'You will receive an email and SMS confirmation shortly.'],
              ['2. Packing & Quality Check', 'Our team carefully packs and inspects your items.'],
              ['3. Dispatch & Tracking', 'You will receive a tracking link via SMS once dispatched.'],
              ['4. Delivery', 'Your parcel is delivered right to your doorstep.'],
            ].map(([title, desc], i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111111]">{title}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/account" className="btn-dark flex-1 py-3.5 text-[10px] uppercase tracking-widest">
            View Order Status
          </Link>
          <Link href="/shop" className="btn-ghost flex-1 py-3.5 text-[10px] uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
