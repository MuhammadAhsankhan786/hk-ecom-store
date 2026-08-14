'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section))
  }

  return (
    <footer className="bg-[#111111] text-white">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand */}
          <div className="lg:col-span-1 border-b sm:border-b-0 border-[#222] pb-6 sm:pb-0">
            <div className="mb-3">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white">HK FABRIC</span>
              <p className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#D4AF37] mt-0.5 font-semibold">Timeless Comfort. Refined Living.</p>
            </div>
            <p className="text-[#6B6B6B] text-xs leading-relaxed max-w-xs mb-5">
              Premium quality home textiles designed for comfort, style and luxurious living.
            </p>
            {/* Social Icons with rounded-full styling */}
            <div className="flex gap-2.5">
              {[
                { name: 'facebook', label: 'FB' },
                { name: 'instagram', label: 'IG' },
                { name: 'tiktok', label: 'TK' },
                { name: 'youtube', label: 'YT' }
              ].map(s => (
                <a
                  key={s.name}
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#888] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-200"
                  aria-label={s.name}
                >
                  <span className="text-[9px] uppercase font-bold">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (Collapsible Accordion on Mobile) */}
          <div className="border-b sm:border-b-0 border-[#222] pb-4 sm:pb-0">
            <button
              onClick={() => toggleSection('quick')}
              className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-0 sm:mb-4 py-2 sm:py-0 rounded-lg"
            >
              <span>Quick Links</span>
              <span className="sm:hidden text-lg text-[#6B6B6B]">{openSection === 'quick' ? '−' : '+'}</span>
            </button>
            <div className={`space-y-2 text-xs transition-all ${openSection === 'quick' ? 'block pt-2' : 'hidden sm:block'}`}>
              <ul className="space-y-2.5">
                {[
                  ['About Us', '/about'],
                  ['Contact Us', '/contact'],
                  ['FAQs', '/faq'],
                  ['Shipping Policy', '/shipping-policy'],
                  ['Return Policy', '/return-policy'],
                  ['Privacy Policy', '/privacy-policy']
                ].map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="text-[#6B6B6B] hover:text-white transition-colors block py-0.5">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Service (Collapsible Accordion on Mobile) */}
          <div className="border-b sm:border-b-0 border-[#222] pb-4 sm:pb-0">
            <button
              onClick={() => toggleSection('customer')}
              className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-0 sm:mb-4 py-2 sm:py-0 rounded-lg"
            >
              <span>Customer Service</span>
              <span className="sm:hidden text-lg text-[#6B6B6B]">{openSection === 'customer' ? '−' : '+'}</span>
            </button>
            <div className={`space-y-2 text-xs transition-all ${openSection === 'customer' ? 'block pt-2' : 'hidden sm:block'}`}>
              <ul className="space-y-2.5">
                {[
                  ['My Account', '/account'],
                  ['Track Order', '/account'],
                  ['Wishlist', '/wishlist'],
                  ['Returns', '/return-policy'],
                  ['Terms & Conditions', '/terms'],
                  ['Store Locator', '/contact']
                ].map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="text-[#6B6B6B] hover:text-white transition-colors block py-0.5">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Us (Collapsible Accordion on Mobile) */}
          <div className="border-b sm:border-b-0 border-[#222] pb-4 sm:pb-0">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-0 sm:mb-4 py-2 sm:py-0 rounded-lg"
            >
              <span>Contact Us</span>
              <span className="sm:hidden text-lg text-[#6B6B6B]">{openSection === 'contact' ? '−' : '+'}</span>
            </button>
            <div className={`space-y-2 text-xs text-[#6B6B6B] transition-all ${openSection === 'contact' ? 'block pt-2' : 'hidden sm:block'}`}>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  +92 300 1234567
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  support@hkfabric.com
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  Lahore, Pakistan
                </li>
                <li className="text-[10px] text-[#555] mt-1 pl-8">Mon - Sat: 10AM - 8PM</li>
              </ul>
            </div>
          </div>

          {/* Newsletter Box Container (Rounded Box) */}
          <div>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-2xl p-5 sm:p-6 shadow-sm">
              <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-1.5">Newsletter</h4>
              <p className="text-[#888] text-xs mb-4 leading-relaxed">Subscribe for new arrivals & exclusive offers.</p>
              {subscribed ? (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs p-3 rounded-xl font-medium text-center">
                  ✨ Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true) }} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 bg-[#111111] border border-[#333] text-xs text-white placeholder:text-[#666] rounded-xl focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  />
                  <button type="submit" className="w-full btn-gold py-2.5 text-[10px] tracking-widest uppercase font-semibold rounded-xl shadow-md transition-all hover:shadow-lg">
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1E1E1E]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#6B6B6B] text-[10px] sm:text-[11px]">&copy; 2026 HK Fabric. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-[#888] bg-[#1C1C1C] border border-[#333] px-3 py-1 rounded-full uppercase">Easypaisa</span>
            <span className="text-[9px] font-semibold text-[#888] bg-[#1C1C1C] border border-[#333] px-3 py-1 rounded-full uppercase">VISA</span>
            <span className="text-[9px] font-semibold text-[#888] bg-[#1C1C1C] border border-[#333] px-3 py-1 rounded-full uppercase">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
