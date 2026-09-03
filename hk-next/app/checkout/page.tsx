'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '../../src/store'
import { getApiBaseUrl } from '../../src/services/api'

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { n: 1, label: 'Information' },
  { n: 2, label: 'Delivery' },
  { n: 3, label: 'Review' },
  { n: 4, label: 'Online Payment' },
]

function StepBar({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-colors
              ${current > s.n ? 'bg-[#D4AF37] border-[#D4AF37] text-[#111111]' : current === s.n ? 'bg-[#111111] border-[#111111] text-white' : 'border-[#E8E5DE] text-[#6B6B6B]'}`}>
              {current > s.n ? (
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : s.n}
            </div>
            <span className={`text-[9px] uppercase tracking-widest mt-1 hidden sm:block ${current === s.n ? 'text-[#111111] font-semibold' : 'text-[#6B6B6B]'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 transition-colors ${current > s.n ? 'bg-[#D4AF37]' : 'bg-[#E8E5DE]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore()
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [paying, setPaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedGateway, setSelectedGateway] = useState<'PayFast' | 'Easypaisa'>('PayFast')

  const [formData, setFormData] = useState({
    firstName: 'Ayesha',
    lastName: 'Khan',
    email: 'ayesha.khan@example.com',
    phone: '03001234567',
    address1: 'Main Boulevard, Gulberg III',
    address2: 'Block H',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54000',
  })

  const shipping = cartTotal >= 5000 ? 0 : 250
  const grandTotal = cartTotal + shipping

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step)
  }

  const handlePay = async () => {
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.')
      return
    }

    setPaying(true)
    setErrorMessage(null)

    try {
      const idempotencyKey = `chk-${Date.now()}-${Math.floor(Math.random() * 100000)}`

      // 1. Create Order in PENDING status with atomic stock reservation
      const orderRes = await fetch(`${getApiBaseUrl()}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: `${formData.address1}, ${formData.address2}`,
          city: formData.city,
          paymentMethod: selectedGateway,
          items: cart.map(i => ({
            productId: String(i.id),
            productName: i.name,
            productSku: `SKU-${i.id}`,
            variantSize: i.selectedSize,
            variantColor: i.selectedColor,
            unitPrice: i.price,
            quantity: i.qty,
          })),
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.message || 'Failed to place order due to stock availability or input validation.')
      }

      const createdOrder = orderData.order

      // 2. Initiate Online Payment Session via Active Payment Provider
      const paymentRes = await fetch(`${getApiBaseUrl()}/payments/initiate/${createdOrder.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify({ gateway: selectedGateway }),
      })

      const paymentData = await paymentRes.json()

      if (!paymentRes.ok) {
        throw new Error(paymentData.message || 'Failed to initiate online payment session with payment provider.')
      }

      clearCart()

      // 3. Post parameters or redirect to gateway return URL
      if (paymentData.params && Object.keys(paymentData.params).length > 0 && paymentData.postUrl) {
        const form = document.createElement('form')
        form.method = paymentData.httpMethod || 'POST'
        form.action = paymentData.postUrl

        Object.keys(paymentData.params).forEach(key => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(paymentData.params[key])
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      } else {
        router.push(`/order-confirmation?orderNumber=${createdOrder.orderNumber}&orderId=${createdOrder.id}`)
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Sorry! Payment initiation failed or stock was reserved by another customer.')
      setPaying(false)
    }
  }

  return (
    <main className="bg-[#F8F7F3] min-h-screen">
      {/* Header strip */}
      <div className="bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-[#111111]">
            HK Fabric
            <span className="block text-[8px] tracking-[0.25em] uppercase text-[#D4AF37] leading-none">Home Textiles</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
            <svg width="12" height="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Encrypted Online Checkout
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <StepBar current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: Form */}
          <div className="bg-white p-6 lg:p-8">
            {step === 1 && (
              <div>
                <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Customer Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">First Name *</label>
                    <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Last Name *</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Email Address *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Phone Number (Pakistani Mobile) *</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Address Line 1 *</label>
                    <input type="text" value={formData.address1} onChange={e => setFormData({ ...formData, address1: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Address Line 2</label>
                    <input type="text" value={formData.address2} onChange={e => setFormData({ ...formData, address2: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">City *</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Province *</label>
                    <select value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm bg-white">
                      <option>Punjab</option>
                      <option>Sindh</option>
                      <option>KPK</option>
                      <option>Balochistan</option>
                      <option>Islamabad (ICT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 py-4 border-b border-[#E8E5DE]">
                      <div className="w-16 h-16 bg-[#F8F7F3] overflow-hidden shrink-0">
                        <img src={item.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111111] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{item.selectedSize} · {item.selectedColor} · Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#111111]">Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-serif text-xl font-500 text-[#111111] mb-2">Online Payment Selection</h2>
                <p className="text-xs text-[#6B6B6B] mb-6">HK Fabric is an online-payment-only store. Cash on Delivery is disabled.</p>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800">
                    <svg className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Payment / Reservation Notice</p>
                      <p className="text-xs mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Gateway Provider Selection */}
                <div className="space-y-4 mb-6">
                  <div
                    onClick={() => setSelectedGateway('PayFast')}
                    className={`border-2 p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      selectedGateway === 'PayFast' ? 'border-[#D4AF37] bg-[#FDFCF7]' : 'border-[#E8E5DE] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#111111] text-[#D4AF37] rounded flex items-center justify-center font-bold text-xs">
                        PF
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">PayFast Online Checkout</p>
                        <p className="text-[10px] text-[#6B6B6B]">Credit/Debit Cards, Bank Transfer & Mobile Wallet</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${selectedGateway === 'PayFast' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#E8E5DE]'}`} />
                  </div>

                  <div
                    onClick={() => setSelectedGateway('Easypaisa')}
                    className={`border-2 p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      selectedGateway === 'Easypaisa' ? 'border-[#D4AF37] bg-[#FDFCF7]' : 'border-[#E8E5DE] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#1DB954] text-white rounded flex items-center justify-center font-bold text-xs">
                        EP
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">Easypaisa Wallet Checkout</p>
                        <p className="text-[10px] text-[#6B6B6B]">Direct Easypaisa Mobile Wallet Payment</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${selectedGateway === 'Easypaisa' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#E8E5DE]'}`} />
                  </div>
                </div>

                <div className="bg-[#F8F7F3] p-4 flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Transactions are encrypted and verified server-side with HMAC cryptographic security.
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8E5DE]">
              {step > 1 ? (
                <button
                  onClick={() => setStep((step - 1) as Step)}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#111111] transition-colors"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" /></svg>
                  Back
                </button>
              ) : (
                <Link href="/cart" className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#111111] transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" /></svg>
                  Back to Cart
                </Link>
              )}

              {step < 4 ? (
                <button onClick={handleNext} className="btn-dark px-8 py-3.5 text-[10px] uppercase tracking-widest">
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={paying || cart.length === 0}
                  className="btn-gold px-10 py-3.5 text-[11px] uppercase tracking-widest disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {paying ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>
                      Initiating Gateway Payment…
                    </>
                  ) : `PAY NOW — Rs. ${grandTotal.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="bg-white p-6 sticky top-24">
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-[#F8F7F3] shrink-0">
                    <img src={item.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{item.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#111111] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#6B6B6B]">{item.selectedSize} · {item.selectedColor}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#111111] shrink-0">Rs. {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8E5DE] pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#111111] pt-2 border-t border-[#E8E5DE]">
                <span>Total</span><span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
