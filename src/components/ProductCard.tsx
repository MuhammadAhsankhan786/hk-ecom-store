'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore, type Product } from '../store'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1639690222869-1e608aa51f82?w=600&h=600&fit=crop&auto=format'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function BadgeTag({ badge }: { badge: string }) {
  const styles: Record<string, string> = {
    sale: 'bg-[#111111] text-white',
    new: 'bg-[#D4AF37] text-[#111111]',
    limited: 'bg-[#8B4513] text-white',
  }
  return (
    <span className={`text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold px-1.5 sm:px-2 py-0.5 rounded-sm ${styles[badge] || 'bg-[#111111] text-white'}`}>
      {badge === 'limited' ? 'Limited' : badge}
    </span>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const [imgSrc, setImgSrc] = useState(product.image)
  const inWishlist = isInWishlist(product.id)
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0

  return (
    <div className="group relative flex flex-col bg-white border border-[#E8E5DE] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative product-img-wrap bg-[#F8F7F3] aspect-square overflow-hidden rounded-t-xl">
        <Link href={`/product/${product.slug}`}>
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.badge && <BadgeTag badge={product.badge} />}
          {discount > 0 && (
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold px-1.5 sm:px-2 py-0.5 rounded-sm bg-[#D4AF37] text-[#111111]">-{discount}%</span>
          )}
          {!product.inStock && (
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold px-1.5 sm:px-2 py-0.5 rounded-sm bg-[#6B6B6B] text-white">Out of Stock</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-sm flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F8F7F3] z-10"
          aria-label="Add to wishlist"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={inWishlist ? '#D4AF37' : 'none'} stroke={inWishlist ? '#D4AF37' : '#111111'} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-0.5 font-semibold">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="text-xs sm:text-sm font-semibold text-[#111111] hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2 mb-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Stars rating={product.rating} />
          <span className="text-[9px] sm:text-[10px] text-[#6B6B6B]">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-xs sm:text-sm font-bold text-[#111111]">Rs. {product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-[10px] sm:text-xs text-[#6B6B6B] line-through">Rs. {product.oldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Solid Black ADD TO CART button with rounded-lg styling */}
        <button
          onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
          disabled={!product.inStock}
          className="mt-auto w-full bg-[#111111] text-white text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#D4AF37] hover:text-[#111111] transition-colors disabled:opacity-50"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 1 2 2h14a2 2 0 0 1 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {product.inStock ? 'Add To Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}
