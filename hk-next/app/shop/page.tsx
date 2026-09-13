'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '../../src/components/ProductCard'
import { products as fallbackProducts, type Product } from '../../src/data/products'
import { fetchProductsFromAPI } from '../../src/services/api'

const CATEGORIES = [
  'All',
  'Comforter Set Bridal 9 Pieces',
  'Bridal Bedcover 8 Pieces Set',
  'Towel & Towel Sets',
  'Fleece Summer Blankets',
  'Cotton Comforter & Comforter Sets',
  'Cotton Bedsheets',
  'Imported Bedspreads',
  'Medicated Pillows',
  'Embroidery Bedsheets',
  'Velvet Bedsheets',
  'Jacquard Bedsheets',
]
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
  const [liveProducts, setLiveProducts] = useState<Product[]>([])

  // Dynamically sync category state whenever searchParams / URL query changes (e.g. from Header mega menu links)
  useEffect(() => {
    const catParam = searchParams.get('category')
    if (catParam) {
      setCategory(catParam)
    } else {
      setCategory('All')
    }
  }, [searchParams])

  // Fetch live products from NestJS REST API and sync in real-time without page refresh
  useEffect(() => {
    let isMounted = true

    async function loadAPIProducts() {
      try {
        const res = await fetchProductsFromAPI()
        if (res && res.data && isMounted) {
          const mapped: Product[] = res.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category?.name || 'Bedsheets',
            price: p.price,
            oldPrice: p.salePrice || undefined,
            rating: 5.0,
            reviews: p.reviews?.length || 12,
            image: p.images && p.images.length > 0 ? p.images[0].url : 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
            images: p.images ? p.images.map((img: any) => img.url) : [],
            badge: 'new',
            publishedAt: p.publishedAt || p.createdAt,
            status: p.status,
            inStock: p.stock > 0,
            material: p.description || '100% Cotton Satin',
            sizes: p.variants?.map((v: any) => v.size) || ['King', 'Queen'],
            colors: p.variants?.map((v: any) => v.color) || ['Gold', 'Maroon'],
            description: p.description,
            sku: p.sku,
            createdAt: p.createdAt,
          }))

          // Sort mapped DB items by date descending so newly created products are #1
          mapped.sort((a: any, b: any) => {
            const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime()
            const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime()
            return timeB - timeA
          })

          setLiveProducts(mapped)
        }
      } catch (err) {
        console.warn('Backend API connection pending or offline, fallback to store state:', err)
      }
    }

    loadAPIProducts()

    // 1. Fast auto-polling every 1.5 seconds for instant zero-refresh updates
    const intervalId = setInterval(loadAPIProducts, 1500)

    // 2. Window focus refetching
    const handleFocus = () => loadAPIProducts()
    window.addEventListener('focus', handleFocus)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Infinite Scroll state
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerTargetRef = useRef<HTMLDivElement>(null)

  // Reset pagination batch when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH)
  }, [category, sort, priceRange, initialBadge, initialSale])

const SUBCATEGORIES_MAP: Record<string, string[]> = {
  'Cotton Bedsheets': ['Single Bedsheets', 'Double Bedsheets', 'Export Quality Bedsheets'],
  'Comforter Set Bridal 9 Pieces': ['Cotton Bridal Set', 'Fancy Zari Bridal Set', 'Velvet Bridal Set', 'Silk & Chenille Bridal Set'],
  'Fleece Summer Blankets': ['Single Fleece Blanket', 'Double Fleece Blanket', 'Heavy Mink Blanket'],
  'Cotton Comforter & Comforter Sets': ['6-Piece Comforter Set', '4-Piece Comforter Set', 'King Size Duvet Set'],
}

  const filtered = useMemo(() => {
    let list = [...liveProducts]
    if (category !== 'All') {
      const allowed = [category, ...(SUBCATEGORIES_MAP[category] || [])]
      list = list.filter(p => allowed.includes(p.category))
    }
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
    <div className="space-y-6 bg-white p-5 rounded-2xl border border-[#E8E5DE] shadow-sm">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
        <h4 className="text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Categories & Varieties
        </h4>
        {category !== 'All' && (
          <button 
            onClick={() => setCategory('All')} 
            className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] hover:text-[#111111] transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Category List (Zero Scrollbars) */}
      <div className="space-y-1.5">
        {CATEGORIES.map(c => {
          const isActive = category === c
          const count = c === 'All' 
            ? liveProducts.length 
            : liveProducts.filter(p => p.category === c || (SUBCATEGORIES_MAP[c] || []).includes(p.category)).length

          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                isActive 
                  ? 'bg-[#111111] text-white shadow-md font-semibold translate-x-1' 
                  : 'text-[#4A4A4A] hover:bg-[#F8F7F3] hover:text-[#111111] hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-[#D4AF37] scale-125' : 'bg-[#E8E5DE] group-hover:bg-[#D4AF37]'}`} />
                <span className="truncate">{c}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                isActive ? 'bg-[#D4AF37] text-[#111111]' : 'bg-[#F8F7F3] text-[#6B6B6B] group-hover:bg-[#E8E5DE] group-hover:text-[#111111]'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Price Range */}
      <div className="border-t border-[#E8E5DE] pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#111111]">Price Limit</h4>
          <span className="text-xs font-bold text-[#D4AF37]">Up to Rs. {priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={25000}
          step={500}
          value={priceRange[1]}
          onChange={e => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-[#D4AF37] bg-[#E8E5DE] h-1.5 rounded-lg cursor-pointer"
        />
        {/* Quick Price Preset Chips */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[
            { label: '< Rs. 5k', val: 5000 },
            { label: '< Rs. 12k', val: 12000 },
            { label: 'All Prices', val: 25000 },
          ].map(preset => (
            <button
              key={preset.val}
              onClick={() => setPriceRange([0, preset.val])}
              className={`text-[10px] font-semibold py-1 px-1.5 rounded-md border transition-all cursor-pointer text-center ${
                priceRange[1] === preset.val 
                  ? 'bg-[#D4AF37] text-[#111111] border-[#D4AF37]' 
                  : 'bg-[#F8F7F3] text-[#6B6B6B] border-[#E8E5DE] hover:border-[#D4AF37] hover:text-[#111111]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Options */}
      <div className="border-t border-[#E8E5DE] pt-5 space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-bold text-[#111111]">Filter Options</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] cursor-pointer hover:border-[#D4AF37] transition-all">
            <span className="text-xs font-medium text-[#111111]">In Stock Only</span>
            <input type="checkbox" className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer" />
          </label>
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] cursor-pointer hover:border-[#D4AF37] transition-all">
            <span className="text-xs font-medium text-[#111111]">On Sale Items</span>
            <input type="checkbox" className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer" />
          </label>
        </div>
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

      {/* Shop Luxury Hero Banner with Category Quick Cards */}
      <div className="relative bg-[#111111] overflow-hidden text-white border-b border-[#E8E5DE]">
        <img
          src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1920&q=80&fit=crop"
          alt="HK Fabric Luxury Bedding Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2 font-semibold backdrop-blur-xs">
              ✨ HK FABRIC PAKISTAN — OFFICIAL COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-500 text-white leading-tight mb-2 drop-shadow-md">
              {category === 'All' ? 'Complete HK Luxury Bedding Store' : category}
            </h1>
            <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-xl">
              Handcrafted Pakistani bridal comforter sets, 400TC Egyptian cotton satin bedsheets, plush Korean double mink blankets & medicated pillows. Showing {visibleProducts.length} of {filtered.length} luxury products.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Horizontal Category Navigation Bar (Zero Sidebars, 100% Minimalist) */}
        <div className="mb-6 border-b border-[#E8E5DE] pb-4">
          <div className="flex items-center gap-2 flex-wrap py-1">
            {CATEGORIES.map(c => {
              const isActive = category === c
              const count = c === 'All' 
                ? liveProducts.length 
                : liveProducts.filter(p => p.category === c || (SUBCATEGORIES_MAP[c] || []).includes(p.category)).length

              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-[#111111] text-[#D4AF37] shadow-md scale-102 font-bold' 
                      : 'bg-[#F8F7F3] text-[#4A4A4A] border border-[#E8E5DE] hover:bg-white hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  <span>{c}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#D4AF37] text-[#111111]' : 'bg-[#E8E5DE] text-[#6B6B6B]'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Variety Subcategory Pills Bar (Single, Double, Export Quality, Zari, Velvet, etc.) */}
          {SUBCATEGORIES_MAP[category] && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] flex-wrap">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mr-1 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                {category} Varieties:
              </span>
              {SUBCATEGORIES_MAP[category].map(sub => (
                <button
                  key={sub}
                  onClick={() => setCategory(sub)}
                  className="text-[11px] bg-white border border-[#E8E5DE] hover:border-[#D4AF37] hover:text-[#D4AF37] text-[#111111] font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                >
                  • {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 100% Full-Width Main Area */}
        <div className="w-full">
          {/* Top Control Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap bg-[#F8F7F3] p-3 rounded-xl border border-[#E8E5DE]">
            {/* Filter Drawer Trigger Button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold bg-white text-[#111111] border border-[#E8E5DE] rounded-lg px-4 py-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer shadow-2xs"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter & Refine
              {priceRange[1] < 25000 && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-[#6B6B6B] font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="text-xs border border-[#E8E5DE] rounded-lg px-3 py-2 text-[#111111] bg-white focus:outline-none focus:border-[#D4AF37] cursor-pointer font-semibold"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Grid Layout Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-white border border-[#E8E5DE] rounded-lg p-0.5">
                {(['2', '3', '4'] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setGridView(n)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${gridView === n ? 'bg-[#111111] text-[#D4AF37]' : 'text-[#6B6B6B] hover:text-[#111111]'}`}
                  >
                    {n} Cols
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full-Width Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-[#F8F7F3] rounded-2xl p-8 border border-[#E8E5DE]">
              <svg className="mx-auto mb-4 text-[#E8E5DE]" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <h3 className="font-serif text-xl text-[#111111] mb-2">No products found</h3>
              <p className="text-sm text-[#6B6B6B]">Try adjusting your search criteria or browse all luxury bedding</p>
              <button onClick={() => { setCategory('All'); setPriceRange([0, 25000]) }} className="mt-4 bg-[#111111] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-[#D4AF37] hover:text-[#111111] transition-colors cursor-pointer">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${gridCols[gridView]} gap-4 sm:gap-6`}>
              {visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Infinite Scroll Sensor Target */}
          <div ref={observerTargetRef} className="py-12 text-center">
            {isLoadingMore && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F8F7F3] border border-[#E8E5DE] text-xs text-[#111111] font-medium shadow-xs">
                <svg className="animate-spin" width="14" height="14" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>
                <span>Loading more luxury bedding...</span>
              </div>
            )}
            {!hasMore && filtered.length > 0 && (
              <div className="text-xs text-[#6B6B6B] font-semibold tracking-wider uppercase">
                ✓ Showing all {filtered.length} products
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Slide-Over Filter Drawer (Available for both Desktop & Mobile) */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DE] mb-6">
              <h3 className="font-serif text-xl font-bold text-[#111111] flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filter & Refine
              </h3>
              <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full bg-[#F8F7F3] flex items-center justify-center text-[#111111] hover:bg-[#E8E5DE] transition-colors cursor-pointer">
                ✕
              </button>
            </div>
            
            <div className="flex-1">
              <FilterPanel />
            </div>

            <div className="pt-6 border-t border-[#E8E5DE] mt-6 flex gap-3">
              <button
                onClick={() => { setCategory('All'); setPriceRange([0, 25000]); setFilterOpen(false) }}
                className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold border border-[#E8E5DE] text-[#6B6B6B] rounded-xl hover:bg-[#F8F7F3] hover:text-[#111111] transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3 text-xs uppercase tracking-widest font-bold bg-[#111111] text-[#D4AF37] rounded-xl hover:bg-[#D4AF37] hover:text-[#111111] transition-colors cursor-pointer shadow-md"
              >
                Apply ({filtered.length})
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
