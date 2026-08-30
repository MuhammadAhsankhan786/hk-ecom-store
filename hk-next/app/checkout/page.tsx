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
  { n: 4, label: 'Payment' },
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

function InputField({ label, placeholder, type = 'text', required }: { label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors"
      />
    </div>
  )
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore()
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [paying, setPaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const shipping = cartTotal >= 5000 ? 0 : 250
  const grandTotal = cartTotal + shipping

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step)
  }

  const handlePay = async () => {
    setPaying(true)
    setErrorMessage(null)

    try {
      // Simulate API call to NestJS backend POST /orders with atomic stock check & idempotency
      const response = await fetch(`${getApiBaseUrl()}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': `chk-${Date.now()}-${Math.random()}`,
        },
        body: JSON.stringify({
          customerName: 'Customer',
          customerEmail: 'customer@example.com',
          customerPhone: '+923001234567',
          shippingAddress: 'Main Boulevard, Gulberg III',
          city: 'Lahore',
          paymentMethod: 'Easypaisa',
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
      }).catch(() => null)

      if (response && !response.ok) {
        const errorData = await response.json().catch(() => null)
        if (response.status === 409 || response.status === 400) {
          throw new Error(errorData?.message || 'Sorry, this product was just purchased by another customer and is now out of stock.')
        }
      }

      // Simulate successful payment wait
      await new Promise(r => setTimeout(r, 1500))
      clearCart()
      router.push('/order-confirmation')
    } catch (err: any) {
      setErrorMessage(err.message || 'Sorry! This product just went out of stock. Stock was reserved by another concurrent customer.')
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
            Secure Checkout
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
                  <InputField label="First Name" placeholder="Ayesha" required />
                  <InputField label="Last Name" placeholder="Khan" required />
                  <div className="sm:col-span-2"><InputField label="Email Address" type="email" placeholder="you@example.com" required /></div>
                  <div className="sm:col-span-2"><InputField label="Phone Number" placeholder="+92 300 0000000" required /></div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input type="checkbox" id="newsletter" className="accent-[#D4AF37]" />
                  <label htmlFor="newsletter" className="text-xs text-[#6B6B6B]">Subscribe to our newsletter for exclusive offers and new arrivals</label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><InputField label="Address Line 1" placeholder="House / Flat / Street" required /></div>
                  <div className="sm:col-span-2"><InputField label="Address Line 2" placeholder="Area / Sector / Block (optional)" /></div>
                  <InputField label="City" placeholder="Lahore" required />
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Province <span className="text-red-500">*</span></label>
                    <select className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] bg-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                      <option>Punjab</option>
                      <option>Sindh</option>
                      <option>KPK</option>
                      <option>Balochistan</option>
                      <option>Islamabad (ICT)</option>
                      <option>AJK</option>
                    </select>
                  </div>
                  <InputField label="Postal Code" placeholder="54000" />
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Country</label>
                    <select className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] bg-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                      <option>Pakistan</option>
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
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111111] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{item.selectedSize} · {item.selectedColor} · Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#111111]">Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#111111] pt-2.5 border-t border-[#E8E5DE]">
                    <span>Grand Total</span><span>Rs. {(cartTotal + shipping).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Payment</h2>
                
                {/* Out of Stock Error Alert */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800">
                    <svg className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Inventory Reservation Alert</p>
                      <p className="text-xs mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="border-2 border-[#D4AF37] bg-[#FDFCF7] p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#1DB954] rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold tracking-wide">EP</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">Easypaisa Online Payment</p>
                      <p className="text-[10px] text-[#6B6B6B]">Fast, secure, and convenient</p>
                    </div>
                    <div className="ml-auto w-4 h-4 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]" />
                  </div>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    You will be redirected to Easypaisa's secure payment gateway to complete your transaction. Your order will be confirmed immediately after successful payment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Easypaisa Account Number</label>
                    <input
                      type="text"
                      placeholder="03XX-XXXXXXX"
                      className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="Name on account"
                      className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-[#F8F7F3] p-4 flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Your payment information is encrypted and processed securely.
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
                  disabled={paying}
                  className="btn-gold px-10 py-3.5 text-[11px] uppercase tracking-widest disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {paying ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>
                      Processing Payment & Verifying Stock…
                    </>
                  ) : 'Pay Now — Rs. ' + grandTotal.toLocaleString()}
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
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
