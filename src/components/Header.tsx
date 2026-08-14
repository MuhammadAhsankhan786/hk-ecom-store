'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '../store'

export default function Header() {
  const router = useRouter()
  const { cartCount, wishlist } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-[10px] sm:text-[11px] py-2 px-3 sm:px-4">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div className="flex-1 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <svg width="13" height="13" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24" className="shrink-0">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="tracking-wider uppercase font-semibold text-[9px] sm:text-[10px]">
              FREE DELIVERY ALL OVER PAKISTAN
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-white/80 text-[10px]">
            {/* Social Icons (Instagram & Facebook) */}
            <div className="flex items-center gap-3 border-r border-[#333] pr-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1" aria-label="Instagram">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1" aria-label="Facebook">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Customer Support: <span className="font-semibold text-white">+92 300 1234567</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-[#E8E5DE] py-3 sm:py-4">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Search Bar (Desktop) */}
          <div className="hidden lg:block w-72">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-[#F8F7F3] border border-[#E8E5DE] rounded-full py-2 pl-4 pr-10 text-xs text-[#111111] placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4AF37]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111111]">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-[#111111] hover:text-[#D4AF37]"
            aria-label="Open Menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Centered Logo & Tagline */}
          <Link href="/" className="flex flex-col items-center group text-center my-auto">
            <div className="flex items-center gap-1">
              <span className="font-serif text-xl sm:text-3xl font-bold tracking-wider text-[#111111]">HK</span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold">FABRIC</span>
            </div>
            <span className="hidden sm:block text-[8px] text-[#6B6B6B] tracking-widest mt-0.5 font-sans">Timeless Comfort. Refined Living.</span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-1.5 text-[#111111] hover:text-[#D4AF37]"
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            <Link href="/account" className="hidden sm:flex items-center gap-1.5 text-xs text-[#111111] hover:text-[#D4AF37] transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span className="font-medium text-[11px]">Account</span>
            </Link>

            <Link href="/wishlist" className="flex items-center gap-1 text-xs text-[#111111] hover:text-[#D4AF37] transition-colors relative p-1">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="hidden sm:inline font-medium text-[11px]">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#111111] text-[9px] font-bold flex items-center justify-center -mt-2 -ml-1">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="flex items-center gap-1 text-xs text-[#111111] hover:text-[#D4AF37] transition-colors relative p-1">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="hidden sm:inline font-medium text-[11px]">Cart</span>
              <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#111111] text-[9px] font-bold flex items-center justify-center -mt-2 -ml-1">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pt-2 pb-3 border-t border-[#E8E5DE] bg-[#F8F7F3]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bedsheets, comforters, blankets..."
                className="w-full bg-white border border-[#E8E5DE] rounded-full py-2.5 pl-4 pr-10 text-xs text-[#111111] placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4AF37]"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Primary Category Navigation */}
      <nav className="hidden lg:block bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 py-3 text-[11px] font-semibold tracking-wider uppercase">
            <li>
              <Link href="/" className="text-[#111111] hover:text-[#D4AF37] transition-colors relative py-1 border-b-2 border-[#D4AF37]">
                HOME
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Bedsheets" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                BEDSHEETS
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Comforters" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                COMFORTERS
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Blankets" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                BLANKETS
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Cushions" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                CUSHIONS
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                COLLECTIONS
              </Link>
            </li>
            <li>
              <Link href="/shop?badge=new" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                NEW ARRIVALS
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[#111111] hover:text-[#D4AF37] transition-colors py-1 border-b-2 border-transparent hover:border-[#D4AF37]">
                CONTACT US
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="bg-white w-80 max-w-[85vw] h-full shadow-xl overflow-y-auto flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DE] mb-6">
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold">HK FABRIC</span>
                <span className="text-[9px] text-[#D4AF37] tracking-widest uppercase">Timeless Comfort</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu" className="p-1">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <ul className="space-y-4 text-xs font-semibold uppercase tracking-wider text-[#111111]">
              <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>HOME</Link></li>
              <li><Link href="/shop?category=Bedsheets" onClick={() => setMobileMenuOpen(false)}>BEDSHEETS</Link></li>
              <li><Link href="/shop?category=Comforters" onClick={() => setMobileMenuOpen(false)}>COMFORTERS</Link></li>
              <li><Link href="/shop?category=Blankets" onClick={() => setMobileMenuOpen(false)}>BLANKETS</Link></li>
              <li><Link href="/shop?category=Cushions" onClick={() => setMobileMenuOpen(false)}>CUSHIONS</Link></li>
              <li><Link href="/shop" onClick={() => setMobileMenuOpen(false)}>COLLECTIONS</Link></li>
              <li><Link href="/shop?badge=new" onClick={() => setMobileMenuOpen(false)}>NEW ARRIVALS</Link></li>
              <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)}>CONTACT US</Link></li>
            </ul>

            <div className="mt-auto pt-6 border-t border-[#E8E5DE] space-y-3">
              <div className="flex items-center gap-4 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#111111] hover:text-[#D4AF37]">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#111111] hover:text-[#D4AF37]">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
