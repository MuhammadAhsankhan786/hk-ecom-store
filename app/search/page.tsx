'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '../../src/components/ProductCard'
import { products } from '../../src/data/products'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">Search</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1">Search Results</p>
          <h1 className="font-serif text-3xl font-500 text-[#111111]">
            {query ? `Results for "${query}"` : 'Search Products'}
          </h1>
          {query && <p className="text-sm text-[#6B6B6B] mt-1">{results.length} items found</p>}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 bg-[#F8F7F3] max-w-lg mx-auto p-8">
            <svg className="mx-auto mb-4 text-[#E8E5DE]" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <h2 className="font-serif text-xl text-[#111111] mb-2">No matching products found</h2>
            <p className="text-sm text-[#6B6B6B] mb-6">Try searching with different keywords like "cotton", "comforter", "king", or "bedsheet".</p>
            <Link href="/shop" className="btn-dark inline-block px-8 py-3.5 text-[10px] uppercase tracking-widest">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Searching...</div>}>
      <SearchContent />
    </Suspense>
  )
}
