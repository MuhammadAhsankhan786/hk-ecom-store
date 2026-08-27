'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '../../src/components/ProductCard'
import { products as fallbackProducts, type Product } from '../../src/data/products'
import { fetchProductsFromAPI } from '../../src/services/api'

const CATEGORIES = ['All', 'Bedsheets', 'Comforters', 'Blankets', 'Cushions']
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

const ITEMS_PER_BATCH = 8

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  const initialBadge = searchParams.get('badge') || ''
  const initialSale = searchParams.get('sale') === 'true'

  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 25000])
  const [filterOpen, setFilterOpen] = useState(false)
  const [gridView, setGridView] = useState<'2' | '3' | '4'>('4')
  const [liveProducts, setLiveProducts] = useState<Product[]>(fallbackProducts)

  // Fetch live products from NestJS REST API on mount
  useEffect(() => {
    async function loadAPIProducts() {
      const res = await fetchProductsFromAPI()
      if (res && res.data && res.data.length > 0) {
        const mapped: Product[] = res.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category?.name || 'Bedsheets',
          price: p.price,
          oldPrice: p.salePrice || undefined,
          rating: 5.0,
          reviews: p.reviews?.length || 12,
          image: p.images[0]?.url || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
          images: p.images.map((img: any) => img.url),
          badge: p.isFeatured ? 'new' : undefined,
          publishedAt: p.publishedAt,
          status: p.status,
          inStock: p.stock > 0,
          material: p.description || '100% Cotton Satin',
          sizes: p.variants?.map((v: any) => v.size) || ['King', 'Queen'],
          colors: p.variants?.map((v: any) => v.color) || ['Gold', 'Maroon'],
          description: p.description,
          sku: p.sku,
        }))
        setLiveProducts(mapped)
      }
    }
    loadAPIProducts()
  }, [])

  // Infinite Scroll state
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerTargetRef = useRef<HTMLDivElement>(null)

  // Reset pagination batch when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH)
  }, [category, sort, priceRange, initialBadge, initialSale])

  const filtered = useMemo(() => {
    let list = [...liveProducts]
    if (category !== 'All') list = list.filter(p => p.category === category)
    if (initialBadge) list = list.filter(p => p.badge === initialBadge)
    if (initialSale) list = list.filter(p => p.oldPrice)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'newest': list.sort((a, b) => String(b.id).localeCompare(String(a.id))); break
    }
    return list
  }, [liveProducts, category, sort, priceRange, initialBadge, initialSale])

  // Products slice to display in Infinite Scroll
  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount)
  }, [filtered, visibleCount])

  const hasMore = visibleCount < filtered.length

  // Infinite Scroll IntersectionObserver Sensor
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true)
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + ITEMS_PER_BATCH, filtered.length))
            setIsLoadingMore(false)
          }, 400) // Smooth loading transition delay
        }
      },
      { threshold: 0.2, rootMargin: '100px' }
    )

    const currentTarget = observerTargetRef.current
    if (currentTarget) observer.observe(currentTarget)

    return () => {
      if (currentTarget) observer.unobserve(currentTarget)
    }
  }, [hasMore, isLoadingMore, filtered.length])

  const gridCols = {
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 lg:grid-cols-4',
  }

  const FilterPanel = () => (
    <div className="space-y-6 bg-[#F8F7F3] p-5 rounded-xl border border-[#E8E5DE]">
      {/* Category */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map(c => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => setCategory(c)}
                className="accent-[#D4AF37]"
              />
              <span className="text-sm text-[#6B6B6B] group-hover:text-[#111111] transition-colors">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-[#E8E5DE] pt-5">
        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-3">Price Range</h4>
        <input
          type="range"
          min={0}
          max={15000}
          step={500}
          value={priceRange[1]}
          onChange={e => setPriceRange([0, Number(e.target.value)])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#6B6B6B] mt-1">
          <span>Rs. 0</span>
          <span>Rs. {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-[#E8E5DE] pt-5">
        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-3">Availability</h4>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="accent-[#D4AF37]" />
          <span className="text-sm text-[#6B6B6B]">In Stock Only</span>
        </label>
      </div>

      {/* Rating */}
      <div className="border-t border-[#E8E5DE] pt-5">
        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-3">Rating</h4>
        {[5, 4, 3].map(r => (
          <label key={r} className="flex items-center gap-2.5 cursor-pointer mb-2">
            <input type="checkbox" className="accent-[#D4AF37]" />
            <span className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= r ? '#D4AF37' : '#E8E5DE'} stroke={s <= r ? '#D4AF37' : '#E8E5DE'} strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span className="text-xs text-[#6B6B6B]">& up</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">{category === 'All' ? 'All Products' : category}</span>
          </div>
        </div>
      </div>

      {/* Category header */}
      <div className="border-b border-[#E8E5DE] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-serif text-3xl font-500 text-[#111111]">{category === 'All' ? 'All Products' : category}</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Showing {visibleProducts.length} of {filtered.length} products</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterPanel />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {/* Mobile filter */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold border border-[#E8E5DE] rounded-lg px-3 py-2 hover:border-[#111111] transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                Filter
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="ml-auto text-xs border border-[#E8E5DE] rounded-lg px-3 py-2 text-[#111111] bg-white focus:outline-none focus:border-[#D4AF37]"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              {/* Grid view */}
              <div className="hidden sm:flex gap-1 border border-[#E8E5DE] rounded-lg p-0.5">
                {(['2', '3', '4'] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setGridView(n)}
                    className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-md transition-colors ${gridView === n ? 'bg-[#111111] text-white' : 'text-[#6B6B6B] hover:text-[#111111]'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${category === c ? 'bg-[#111111] text-white' : 'border border-[#E8E5DE] text-[#6B6B6B] hover:border-[#111111] hover:text-[#111111]'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-[#F8F7F3] rounded-2xl p-8 border border-[#E8E5DE]">
                <svg className="mx-auto mb-4 text-[#E8E5DE]" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <h3 className="font-serif text-xl text-[#111111] mb-2">No products found</h3>
                <p className="text-sm text-[#6B6B6B]">Try adjusting your filters or browse all products</p>
                <button onClick={() => { setCategory('All'); setPriceRange([0, 15000]) }} className="mt-4 btn-dark px-6 py-2.5 text-[10px] uppercase tracking-widest rounded-lg">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${gridCols[gridView]} gap-x-4 gap-y-8`}>
                {visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Infinite Scroll Sensor Target */}
            <div ref={observerTargetRef} className="py-12 text-center">
              {isLoadingMore && (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F8F7F3] border border-[#E8E5DE] text-xs text-[#111111] font-medium">
                  <svg className="animate-spin" width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>
                  <span>Loading more luxury bedding...</span>
                </div>
              )}
              {!hasMore && filtered.length > 0 && (
                <div className="text-xs text-[#6B6B6B] font-medium tracking-wider uppercase">
                  ✓ You've viewed all {filtered.length} products
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="bg-white w-80 h-full shadow-xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E5DE]">
              <h3 className="text-sm font-semibold uppercase tracking-widest">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 px-5 py-5">
              <FilterPanel />
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setFilterOpen(false)} className="btn-dark w-full py-3 text-[10px] uppercase tracking-widest rounded-lg">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  )
}
