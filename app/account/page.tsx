'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '../../src/store'

type Section = 'dashboard' | 'orders' | 'order-detail' | 'profile' | 'addresses' | 'password' | 'wishlist'

const STATUS_STYLES: Record<string, string> = {
  'Pending Payment': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Paid': 'bg-blue-50 text-blue-700 border-blue-200',
  'Processing': 'bg-purple-50 text-purple-700 border-purple-200',
  'Packed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Shipped': 'bg-orange-50 text-orange-700 border-orange-200',
  'Delivered': 'bg-green-50 text-green-700 border-green-200',
  'Cancelled': 'bg-red-50 text-red-700 border-red-200',
  'Refunded': 'bg-gray-50 text-gray-700 border-gray-200',
}

const sampleOrders = [
  { id: 'HKF-7A3F2K', date: '12 Aug 2025', total: 9748, status: 'Shipped', items: 2, image: 'https://images.unsplash.com/photo-1639690222869-1e608aa51f82?w=80&h=80&fit=crop&auto=format', name: 'Premium Digital Printed Bedsheet Set +1 more' },
  { id: 'HKF-2B8M9P', date: '28 Jul 2025', total: 6999, status: 'Delivered', items: 1, image: 'https://images.unsplash.com/photo-1606796913825-2b02883605e9?w=80&h=80&fit=crop&auto=format', name: 'Luxury Jacquard Bedsheet Set' },
  { id: 'HKF-5C1Q4R', date: '10 Jul 2025', total: 5499, status: 'Delivered', items: 1, image: 'https://images.unsplash.com/photo-1619459074324-33d5f591c53e?w=80&h=80&fit=crop&auto=format', name: 'Cashmere Blend Blanket' },
  { id: 'HKF-9D7Z3S', date: '2 Jun 2025', total: 3299, status: 'Refunded', items: 1, image: 'https://images.unsplash.com/photo-1685122121706-a7d632dec1df?w=80&h=80&fit=crop&auto=format', name: 'Decorative Cushion Set (4pc)' },
]

const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <rect x="3" y="3" width="7" height="7" /> },
  { key: 'orders', label: 'My Orders', icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" /> },
  { key: 'wishlist', label: 'Wishlist', icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
  { key: 'profile', label: 'Profile', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  { key: 'addresses', label: 'Addresses', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></> },
  { key: 'password', label: 'Change Password', icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
]

export default function Account() {
  const [section, setSection] = useState<Section>('dashboard')
  const [selectedOrder, setSelectedOrder] = useState(sampleOrders[0])
  const { wishlist, toggleWishlist, addToCart } = useStore()
  const router = useRouter()

  const goto = (s: Section) => {
    setSection(s)
  }

  const Sidebar = () => (
    <aside className="w-56 shrink-0">
      <div className="bg-white p-5 mb-3">
        <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-3">
          <span className="font-serif text-lg font-500 text-[#D4AF37]">A</span>
        </div>
        <p className="text-sm font-semibold text-[#111111]">Ayesha Khan</p>
        <p className="text-xs text-[#6B6B6B]">ayesha@example.com</p>
      </div>
      <nav className="bg-white">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => goto(item.key)}
            className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-colors text-left border-l-2 ${section === item.key ? 'border-[#D4AF37] bg-[#FDFCF7] text-[#111111] font-medium' : 'border-transparent text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F7F3]'}`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">{item.icon}</svg>
            {item.label}
          </button>
        ))}
        <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </nav>
    </aside>
  )

  return (
    <main className="bg-[#F8F7F3] min-h-screen">
      <div className="bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">My Account</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block"><Sidebar /></div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile nav pills */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-5">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => goto(item.key)}
                  className={`shrink-0 text-[10px] uppercase tracking-widest px-3.5 py-2 transition-colors whitespace-nowrap ${section === item.key ? 'bg-[#111111] text-white' : 'border border-[#E8E5DE] text-[#6B6B6B]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Dashboard */}
            {section === 'dashboard' && (
              <div>
                <h1 className="font-serif text-2xl font-500 text-[#111111] mb-6">My Dashboard</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[['Total Orders', '4'], ['Items Purchased', '5'], ['Wishlist', String(wishlist.length)], ['Points', '240']].map(([l, v]) => (
                    <div key={l} className="bg-white p-5">
                      <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2">{l}</p>
                      <p className="font-serif text-3xl font-500 text-[#111111]">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[11px] uppercase tracking-widest font-semibold text-[#111111]">Recent Orders</h2>
                    <button onClick={() => goto('orders')} className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {sampleOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center gap-3 py-3 border-b border-[#E8E5DE] last:border-0">
                        <img src={order.image} alt="" className="w-10 h-10 object-cover bg-[#F8F7F3]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#111111]">#{order.id}</p>
                          <p className="text-[10px] text-[#6B6B6B] truncate">{order.name}</p>
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 border ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {section === 'orders' && (
              <div>
                <h1 className="font-serif text-2xl font-500 text-[#111111] mb-6">My Orders</h1>
                <div className="space-y-4">
                  {sampleOrders.map(order => (
                    <div key={order.id} className="bg-white p-5">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div>
                          <p className="text-xs font-semibold text-[#111111]">Order #{order.id}</p>
                          <p className="text-[10px] text-[#6B6B6B]">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 border ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={order.image} alt="" className="w-14 h-14 object-cover bg-[#F8F7F3]" />
                        <div>
                          <p className="text-sm text-[#111111]">{order.name}</p>
                          <p className="text-sm font-semibold text-[#111111] mt-1">Rs. {order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedOrder(order); goto('order-detail') }}
                          className="text-[10px] uppercase tracking-widest font-semibold border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                        {order.status === 'Delivered' && (
                          <button className="text-[10px] uppercase tracking-widest font-semibold border border-[#D4AF37] text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37] hover:text-[#111111] transition-colors">
                            Buy Again
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Detail */}
            {section === 'order-detail' && (
              <div>
                <button onClick={() => goto('orders')} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#111111] mb-5">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" /></svg>
                  Back to Orders
                </button>
                <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                  <div>
                    <h1 className="font-serif text-2xl font-500 text-[#111111]">Order #{selectedOrder.id}</h1>
                    <p className="text-sm text-[#6B6B6B]">Placed on {selectedOrder.date}</p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-semibold px-3 py-1.5 border ${STATUS_STYLES[selectedOrder.status]}`}>{selectedOrder.status}</span>
                </div>

                {/* Status timeline */}
                <div className="bg-white p-6 mb-4">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-5">Tracking</p>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-3.5 h-px bg-[#E8E5DE]" />
                    {['Ordered', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered'].map((s, i) => {
                      const activeIdx = ['Ordered', 'Paid', 'Processing', 'Packed', 'Shipped', 'Delivered'].indexOf(selectedOrder.status === 'Paid' ? 'Paid' : selectedOrder.status === 'Shipped' ? 'Shipped' : 'Ordered')
                      const done = i <= activeIdx
                      return (
                        <div key={s} className="flex flex-col items-center z-10">
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white ${done ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#E8E5DE]'}`}>
                            {done && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <span className="text-[8px] uppercase tracking-wide mt-1 text-[#6B6B6B] hidden sm:block">{s}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white p-6 mb-4">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-4">Items</p>
                  <div className="flex gap-4">
                    <img src={selectedOrder.image} alt="" className="w-16 h-16 object-cover bg-[#F8F7F3]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#111111]">{selectedOrder.name}</p>
                      <p className="text-xs text-[#6B6B6B] mt-1">King · White · Qty: 1</p>
                    </div>
                    <span className="text-sm font-semibold text-[#111111]">Rs. {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white p-6">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-4">Payment Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal</span><span>Rs. {selectedOrder.total.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[#6B6B6B]"><span>Shipping</span><span className="text-green-600">FREE</span></div>
                    <div className="flex justify-between font-semibold text-[#111111] pt-2 border-t border-[#E8E5DE]"><span>Total Paid</span><span>Rs. {selectedOrder.total.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist */}
            {section === 'wishlist' && (
              <div>
                <h1 className="font-serif text-2xl font-500 text-[#111111] mb-6">My Wishlist</h1>
                {wishlist.length === 0 ? (
                  <div className="bg-white p-16 text-center">
                    <svg className="mx-auto mb-4 text-[#E8E5DE]" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <p className="font-serif text-xl text-[#111111] mb-2">Your wishlist is empty</p>
                    <p className="text-sm text-[#6B6B6B] mb-5">Save items you love for later</p>
                    <Link href="/shop" className="btn-dark inline-block px-6 py-3 text-[10px] uppercase tracking-widest">Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlist.map(p => (
                      <div key={p.id} className="bg-white group">
                        <div className="relative overflow-hidden bg-[#F8F7F3] aspect-square">
                          <Link href={`/product/${p.slug}`}>
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
                          </Link>
                          <button
                            onClick={() => toggleWishlist(p)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                          >
                            <svg width="14" height="14" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-3">
                          <Link href={`/product/${p.slug}`} className="text-sm font-medium text-[#111111] hover:text-[#D4AF37] transition-colors line-clamp-2">{p.name}</Link>
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="text-sm font-semibold text-[#111111]">Rs. {p.price.toLocaleString()}</span>
                              {!p.inStock && <span className="ml-2 text-[9px] uppercase text-red-500 font-semibold">Out of Stock</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p, p.sizes[0], p.colors[0])}
                            disabled={!p.inStock}
                            className="w-full mt-2.5 btn-dark py-2.5 text-[9px] uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {section === 'profile' && (
              <div>
                <h1 className="font-serif text-2xl font-500 text-[#111111] mb-6">My Profile</h1>
                <div className="bg-white p-6 lg:p-8">
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-[#E8E5DE]">
                    <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <span className="font-serif text-2xl font-500 text-[#D4AF37]">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#111111]">Ayesha Khan</p>
                      <p className="text-sm text-[#6B6B6B]">Customer since August 2024</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[['First Name', 'Ayesha'], ['Last Name', 'Khan'], ['Email Address', 'ayesha@example.com'], ['Phone Number', '+92 300 1234567']].map(([l, v]) => (
                      <div key={l}>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">{l}</label>
                        <input defaultValue={v} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="btn-dark px-8 py-3 text-[10px] uppercase tracking-widest mt-6">Save Changes</button>
                </div>
              </div>
            )}

            {/* Addresses */}
            {section === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-serif text-2xl font-500 text-[#111111]">Saved Addresses</h1>
                  <button className="btn-gold px-5 py-2.5 text-[10px] uppercase tracking-widest">+ Add New</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Home', address: 'House #12, Block D, Gulberg III, Lahore, Punjab 54000', default: true },
                    { label: 'Office', address: 'Suite 204, Business Centre, DHA Phase 5, Lahore', default: false },
                  ].map(addr => (
                    <div key={addr.label} className={`bg-white p-5 border-2 ${addr.default ? 'border-[#D4AF37]' : 'border-transparent'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#111111]">{addr.label}</span>
                        {addr.default && <span className="text-[9px] uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 font-semibold">Default</span>}
                      </div>
                      <p className="text-sm text-[#6B6B6B] mb-4">{addr.address}</p>
                      <div className="flex gap-3">
                        <button className="text-[10px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#111111] transition-colors">Edit</button>
                        {!addr.default && <button className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">Remove</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password */}
            {section === 'password' && (
              <div>
                <h1 className="font-serif text-2xl font-500 text-[#111111] mb-6">Change Password</h1>
                <div className="bg-white p-6 lg:p-8 max-w-md">
                  <div className="space-y-4">
                    {[['Current Password', 'Enter current password'], ['New Password', 'Min. 8 characters'], ['Confirm New Password', 'Repeat new password']].map(([l, p]) => (
                      <div key={l}>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">{l}</label>
                        <input type="password" placeholder={p} className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors" />
                      </div>
                    ))}
                    <button className="btn-dark px-8 py-3 text-[10px] uppercase tracking-widest w-full mt-2">Update Password</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
