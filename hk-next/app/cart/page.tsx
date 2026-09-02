'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '../../src/store'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useStore()
  const router = useRouter()

  const shipping = cartTotal >= 5000 ? 0 : 250
  const grandTotal = cartTotal + shipping

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F7F3] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <svg className="mx-auto mb-5 text-[#E8E5DE]" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" />
          </svg>
          <h2 className="font-serif text-2xl text-[#111111] mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#6B6B6B] mb-6">Looks like you haven't added anything yet. Browse our collection and find something you love.</p>
          <Link href="/shop" className="btn-dark inline-block px-8 py-3.5 text-[10px] uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F8F7F3] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="font-serif text-3xl font-500 text-[#111111] mb-8">Shopping Cart <span className="text-lg font-sans font-normal text-[#6B6B6B]">({cart.reduce((s,i) => s+i.qty, 0)} items)</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white p-4 sm:p-5 flex gap-4 sm:gap-5">
                <Link href={`/product/${item.slug}`} className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-[#F8F7F3] overflow-hidden">
                  <img src={item.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B]">{item.category}</p>
                      <Link href={`/product/${item.slug}`} className="text-sm font-medium text-[#111111] hover:text-[#D4AF37] line-clamp-2">{item.name}</Link>
                      <p className="text-xs text-[#6B6B6B] mt-1">{item.selectedSize} · {item.selectedColor}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-[#6B6B6B] hover:text-red-500 transition-colors shrink-0">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E8E5DE]">
                      <button onClick={() => updateQty(item.id, item.selectedSize, item.selectedColor, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-[#111111] hover:bg-[#F8F7F3] transition-colors">−</button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.selectedSize, item.selectedColor, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-[#111111] hover:bg-[#F8F7F3] transition-colors">+</button>
                    </div>
                    <span className="text-sm font-semibold text-[#111111]">Rs. {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#D4AF37] transition-colors mt-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" /></svg>
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white p-6 sticky top-24">
              <h2 className="text-[11px] uppercase tracking-widest font-semibold text-[#111111] mb-5">Order Summary</h2>
              <div className="space-y-3 pb-4 border-b border-[#E8E5DE]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">Subtotal</span>
                  <span className="text-[#111111]">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-[#111111]'}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-[#6B6B6B]">Add Rs. {(5000 - cartTotal).toLocaleString()} more for free shipping</p>
                )}
              </div>
              <div className="flex justify-between py-4 border-b border-[#E8E5DE]">
                <span className="font-semibold text-[#111111]">Total</span>
                <span className="font-semibold text-[#111111]">Rs. {grandTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="btn-dark w-full py-4 text-[10px] uppercase tracking-widest mt-5"
              >
                Proceed to Checkout
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <svg width="12" height="12" fill="none" stroke="#6B6B6B" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-[10px] text-[#6B6B6B]">Secure checkout via Easypaisa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
