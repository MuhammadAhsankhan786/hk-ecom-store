'use client'

import Link from 'next/link'
import { useStore } from '../../src/store'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore()

  return (
    <main className="bg-[#F8F7F3] min-h-screen">
      <div className="bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="font-serif text-3xl font-500 text-[#111111] mb-8">My Wishlist <span className="text-lg font-sans font-normal text-[#6B6B6B]">({wishlist.length} items)</span></h1>

        {wishlist.length === 0 ? (
          <div className="bg-white p-16 text-center max-w-md mx-auto border border-[#E8E5DE]">
            <svg className="mx-auto mb-4 text-[#E8E5DE]" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="font-serif text-xl text-[#111111] mb-2">Your wishlist is empty</p>
            <p className="text-sm text-[#6B6B6B] mb-6">Explore our collections and save your favorite bedsheets, comforters, and blankets.</p>
            <Link href="/shop" className="btn-dark inline-block px-8 py-3.5 text-[10px] uppercase tracking-widest">Browse Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {wishlist.map(p => (
              <div key={p.id} className="bg-white group border border-[#E8E5DE]">
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
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-1">{p.category}</p>
                  <Link href={`/product/${p.slug}`} className="text-sm font-medium text-[#111111] hover:text-[#D4AF37] transition-colors line-clamp-2">{p.name}</Link>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <span className="text-sm font-semibold text-[#111111]">Rs. {p.price.toLocaleString()}</span>
                    {!p.inStock && <span className="text-[9px] uppercase text-red-500 font-semibold">Out of Stock</span>}
                  </div>
                  <button
                    onClick={() => addToCart(p, p.sizes[0], p.colors[0])}
                    disabled={!p.inStock}
                    className="w-full btn-dark py-3 text-[10px] uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
