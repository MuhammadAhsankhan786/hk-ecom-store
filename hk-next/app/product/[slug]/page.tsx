'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { products, type Product } from '../../../src/data/products'
import { useStore } from '../../../src/store'
import ProductCard from '../../../src/components/ProductCard'
import { getApiBaseUrl } from '../../../src/services/api'

function Stars({ rating, large }: { rating: number; large?: boolean }) {
  const size = large ? 16 : 12
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

const reviews = [
  { name: 'Ayesha R.', date: 'July 2025', rating: 5, text: 'Absolutely love the quality. The fabric is so soft and the colours are exactly as shown. Will definitely buy again!', verified: true },
  { name: 'Zara K.', date: 'June 2025', rating: 4, text: 'Very nice bedsheet set, premium quality. Took 3 days to arrive which was fast. Only giving 4 stars because one pillowcase had a tiny stitch issue but customer support resolved it immediately.', verified: true },
  { name: 'Maria S.', date: 'May 2025', rating: 5, text: 'I ordered the king size and it fits perfectly. The digital print is so vibrant. Highly recommended for anyone looking for quality bedding in Pakistan.', verified: true },
]

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()

  const [product, setProduct] = useState<Product | null>(() => {
    return products.find(p => p.slug === slug) || null
  })

  useEffect(() => {
    async function loadLiveProduct() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/products/${slug}`)
        if (res.ok) {
          const p = await res.json()
          setProduct({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category?.name || 'Bedsheets',
            price: p.price,
            oldPrice: p.salePrice || undefined,
            rating: 5.0,
            reviews: p.reviews?.length || 12,
            image: p.images && p.images.length > 0 ? p.images[0].url : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
            images: p.images && p.images.length > 0 ? p.images.map((img: any) => img.url) : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format'],
            badge: p.isFeatured ? 'new' : undefined,
            publishedAt: p.publishedAt,
            status: p.status,
            inStock: p.stock > 0,
            material: p.description || '100% Cotton Satin',
            sizes: p.variants?.map((v: any) => v.size) || ['King', 'Queen'],
            colors: p.variants?.map((v: any) => v.color) || ['Gold', 'Maroon'],
            description: p.description,
            sku: p.sku,
          })
        }
      } catch (err) {
        console.warn('Could not fetch live product detail:', err)
      }
    }
    loadLiveProduct()
  }, [slug])

  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'King')
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || 'Gold')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-serif text-2xl mb-4">Product not found</h2>
        <Link href="/shop" className="btn-dark px-6 py-3 text-[10px] uppercase tracking-widest">Back to Shop</Link>
      </div>
    </div>
  )

  const inWishlist = isInWishlist(product.id)
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0
  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0], qty)
  }

  const handleBuyNow = () => {
    addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0], qty)
    router.push('/checkout')
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-[#D4AF37] transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-[#111111] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 overflow-hidden transition-colors ${activeImage === i ? 'border-[#D4AF37]' : 'border-[#E8E5DE] hover:border-[#111111]'}`}
                >
                  <img src={img.replace('800&h=800', '200&h=200')} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 bg-[#F8F7F3] aspect-square overflow-hidden relative">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 ${product.badge === 'sale' ? 'bg-[#111111] text-white' : product.badge === 'new' ? 'bg-[#D4AF37] text-[#111111]' : 'bg-[#8B4513] text-white'}`}>
                    {product.badge === 'limited' ? 'Limited Edition' : product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2">{product.category}</p>
            <h1 className="font-serif text-2xl lg:text-3xl font-500 text-[#111111] leading-snug mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <Stars rating={product.rating} />
              <span className="text-sm text-[#6B6B6B]">{product.rating} ({product.reviews} reviews)</span>
              <span className="text-xs text-[#6B6B6B]">|</span>
              <span className="text-xs text-[#6B6B6B]">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E8E5DE]">
              <span className="text-2xl font-semibold text-[#111111]">Rs. {product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <>
                  <span className="text-base text-[#6B6B6B] line-through">Rs. {product.oldPrice.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-white bg-[#D4AF37] px-2 py-0.5">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="mb-5">
              {!product.inStock ? (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Out of Stock
                </div>
              ) : product.lowStock ? (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Low Stock — Only a few left
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  In Stock
                </div>
              )}
            </div>

            {/* Size */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-2.5">
                Size: <span className="font-normal text-[#6B6B6B]">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-xs font-medium transition-colors border ${selectedSize === s ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E8E5DE] text-[#111111] hover:border-[#111111]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-2.5">
                Color: <span className="font-normal text-[#6B6B6B]">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 text-xs font-medium transition-colors border ${selectedColor === c ? 'border-[#D4AF37] text-[#111111]' : 'border-[#E8E5DE] text-[#6B6B6B] hover:border-[#111111] hover:text-[#111111]'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[#E8E5DE]">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#111111] hover:bg-[#F8F7F3] transition-colors text-lg">−</button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-[#111111] hover:bg-[#F8F7F3] transition-colors text-lg">+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn-dark py-4 text-[10px] uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${inWishlist ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#E8E5DE] hover:border-[#D4AF37]'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#D4AF37' : 'none'} stroke={inWishlist ? '#D4AF37' : '#111111'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            {product.inStock && (
              <button onClick={handleBuyNow} className="w-full btn-gold py-4 text-[10px] uppercase tracking-widest mb-5">
                Buy Now
              </button>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 py-5 border-t border-[#E8E5DE]">
              {[
                ['Free Delivery', 'All over Pakistan'],
                ['Easy Returns', '15-day return policy'],
                ['Secure Payment', 'Easypaisa & cards'],
                ['Premium Quality', 'Certified materials'],
              ].map(([t, s]) => (
                <div key={t} className="flex items-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-semibold text-[#111111]">{t}</p>
                    <p className="text-[9px] text-[#6B6B6B]">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product tabs */}
        <div className="mt-16 border-t border-[#E8E5DE]">
          <div className="flex gap-8 border-b border-[#E8E5DE]">
            {[['description', 'Description'], ['details', 'Details & Care'], ['reviews', `Reviews (${product.reviews})`]].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setActiveTab(v)}
                className={`text-[11px] uppercase tracking-widest font-medium py-4 border-b-2 transition-colors -mb-px ${activeTab === v ? 'border-[#D4AF37] text-[#111111]' : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-2xl">
            {activeTab === 'description' && (
              <div>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">{product.description}</p>
                <ul className="space-y-2 text-sm text-[#6B6B6B]">
                  <li className="flex gap-2"><span className="text-[#D4AF37]">✓</span> Available in multiple sizes: {product.sizes.join(', ')}</li>
                  <li className="flex gap-2"><span className="text-[#D4AF37]">✓</span> Colors: {product.colors.join(', ')}</li>
                  <li className="flex gap-2"><span className="text-[#D4AF37]">✓</span> Material: {product.material}</li>
                </ul>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                {[
                  ['Material', product.material],
                  ["What's Included", 'Flat sheet × 1, Fitted sheet × 1, Pillowcases × 2'],
                  ['Care Instructions', 'Machine wash cold. Tumble dry low. Do not bleach. Iron on medium heat.'],
                  ['Delivery', 'Free delivery within 3-5 business days across Pakistan'],
                  ['Return Policy', '15-day easy returns. Product must be unused and in original packaging.'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-6 py-3 border-b border-[#E8E5DE]">
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-[#111111] w-32 shrink-0">{k}</span>
                    <span className="text-sm text-[#6B6B6B]">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Rating summary */}
                <div className="flex items-center gap-8 mb-8 p-5 bg-[#F8F7F3]">
                  <div className="text-center">
                    <span className="font-serif text-5xl font-500 text-[#111111]">{product.rating}</span>
                    <Stars rating={product.rating} large />
                    <p className="text-xs text-[#6B6B6B] mt-1">{product.reviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(r => (
                      <div key={r} className="flex items-center gap-3">
                        <span className="text-xs w-4 text-[#6B6B6B]">{r}</span>
                        <div className="flex-1 h-1.5 bg-[#E8E5DE] rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: r === 5 ? '75%' : r === 4 ? '15%' : r === 3 ? '7%' : '3%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews list */}
                <div className="space-y-6">
                  {reviews.map((r, i) => (
                    <div key={i} className="border-b border-[#E8E5DE] pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#111111]">{r.name}</span>
                            {r.verified && <span className="text-[9px] uppercase tracking-widest bg-green-50 text-green-700 px-2 py-0.5 font-semibold">Verified</span>}
                          </div>
                          <Stars rating={r.rating} />
                        </div>
                        <span className="text-xs text-[#6B6B6B]">{r.date}</span>
                      </div>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed mt-2">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E8E5DE]">
            <h2 className="font-serif text-2xl font-500 text-[#111111] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
