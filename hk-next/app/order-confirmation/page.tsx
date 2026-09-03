'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getApiBaseUrl } from '../../src/services/api'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const queryOrderNumber = searchParams?.get('orderNumber') || 'HK-784920'
  const queryOrderId = searchParams?.get('orderId') || ''

  const [orderNumber, setOrderNumber] = useState(queryOrderNumber)
  const [orderId, setOrderId] = useState(queryOrderId)
  const [paymentStatus, setPaymentStatus] = useState<'COMPLETED' | 'PENDING' | 'FAILED'>('PENDING')
  const [orderStatus, setOrderStatus] = useState<string>('PENDING')
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState(false)
  const [retryError, setRetryError] = useState<string | null>(null)

  useEffect(() => {
    if (queryOrderNumber) setOrderNumber(queryOrderNumber)
    if (queryOrderId) setOrderId(queryOrderId)

    const targetId = queryOrderId || queryOrderNumber
    if (targetId) {
      fetch(`${getApiBaseUrl()}/payments/verify/${targetId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.verified && data.paymentStatus === 'COMPLETED') {
            setPaymentStatus('COMPLETED')
            setOrderStatus(data.orderStatus || 'PROCESSING')
          } else if (data.paymentStatus === 'FAILED' || data.paymentStatus === 'CANCELLED') {
            setPaymentStatus('FAILED')
            setOrderStatus(data.orderStatus || 'PENDING')
          } else {
            setPaymentStatus('PENDING')
            setOrderStatus(data.orderStatus || 'PENDING')
          }
        })
        .catch(() => {
          setPaymentStatus('PENDING')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [queryOrderNumber, queryOrderId])

  const handleRetryPayment = async () => {
    const targetId = orderId || orderNumber
    if (!targetId) return

    setRetrying(true)
    setRetryError(null)

    try {
      const res = await fetch(`${getApiBaseUrl()}/payments/retry/${targetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway: 'PayFast' }),
      })

      const data = await res.json()
      if (res.ok && data.postUrl) {
        if (data.params && Object.keys(data.params).length > 0) {
          const form = document.createElement('form')
          form.method = data.httpMethod || 'POST'
          form.action = data.postUrl
          Object.keys(data.params).forEach((key) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = String(data.params[key])
            form.appendChild(input)
          })
          document.body.appendChild(form)
          form.submit()
        } else {
          window.location.href = data.postUrl
        }
      } else {
        throw new Error(data.message || 'Failed to initiate payment retry')
      }
    } catch (err: any) {
      setRetryError(err.message || 'Payment retry failed')
      setRetrying(false)
    }
  }

  return (
    <div className="bg-white max-w-xl w-full p-8 lg:p-12 shadow-sm border border-[#E8E5DE] text-center">
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <svg className="animate-spin text-[#D4AF37] mb-4" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeOpacity=".3" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
          <p className="text-sm font-semibold text-[#111111]">Verifying Payment Status Server-Side…</p>
        </div>
      ) : (
        <>
          {/* Status Icon */}
          {paymentStatus === 'COMPLETED' ? (
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : paymentStatus === 'FAILED' ? (
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          )}

          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-2">HK Fabric Order Summary</p>
          
          <h1 className="font-serif text-3xl font-500 text-[#111111] mb-2">
            {paymentStatus === 'COMPLETED' ? 'Order Confirmed!' : paymentStatus === 'FAILED' ? 'Payment Unsuccessful' : 'Order Placed — Awaiting Payment Verification'}
          </h1>
          
          <p className="text-sm text-[#6B6B6B] mb-6">
            {paymentStatus === 'COMPLETED'
              ? 'Your online payment was verified server-side and your order is now in processing.'
              : paymentStatus === 'FAILED'
              ? 'Your online payment was not completed or failed. You can safely retry payment below.'
              : 'Your order has been recorded. Payment status will update automatically upon gateway confirmation.'}
          </p>

          {retryError && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left">
              ⚠️ {retryError}
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-[#F8F7F3] p-5 text-left mb-8 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B]">Order Number:</span>
              <span className="font-semibold text-[#111111]">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B]">Payment Gateway:</span>
              <span className="font-semibold text-[#111111]">PayFast / Easypaisa Online</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B]">Server Payment Status:</span>
              <span className={`font-semibold px-2 py-0.5 ${
                paymentStatus === 'COMPLETED' ? 'text-emerald-700 bg-emerald-50' : paymentStatus === 'FAILED' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'
              }`}>
                {paymentStatus}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B]">Order Status:</span>
              <span className="font-semibold text-[#111111]">{orderStatus}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            {paymentStatus !== 'COMPLETED' && (
              <button
                onClick={handleRetryPayment}
                disabled={retrying}
                className="btn-gold flex-1 py-3.5 text-[10px] uppercase tracking-widest cursor-pointer disabled:opacity-50"
              >
                {retrying ? 'Initiating Payment Retry…' : '🔄 Retry Online Payment'}
              </button>
            )}
            <Link href="/account" className="btn-dark flex-1 py-3.5 text-[10px] uppercase tracking-widest">
              View Account Orders
            </Link>
            <Link href="/shop" className="btn-ghost flex-1 py-3.5 text-[10px] uppercase tracking-widest">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function OrderConfirmation() {
  return (
    <main className="bg-[#F8F7F3] min-h-screen py-16 lg:py-24 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="bg-white max-w-xl w-full p-12 text-center text-sm font-semibold">
          Loading order details…
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </main>
  )
}
