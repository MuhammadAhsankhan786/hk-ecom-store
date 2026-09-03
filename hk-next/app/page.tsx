'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductCard from '../src/components/ProductCard'
import { products, type Product } from '../src/data/products'
import { fetchProductsFromAPI, fetchCategoriesFromAPI, fetchCollectionsFromAPI } from '../src/services/api'

const heroSlides = [
  {
    tag: 'Royal Pakistani Bridal Collection',
    title: 'Ruby Red & Gold Heavy Bridal Bedding Set',
    subtitle: 'Make your wedding trousseau unforgettable with our 10-piece embroidered Ruby Red velvet bridal set crafted with gold zari embroidery.',
    ctaPrimary: 'Shop Red Bridal Set',
    ctaSecondary: 'View Collections',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=2400&q=100&fit=crop&auto=format',
    link: '/product/ruby-red-bridal-set',
  },
  {
    tag: 'Royal Jacquard Weaves',
    title: 'Emerald Green & Gold Luxury Bedding',
    subtitle: 'Transform your master bedroom with our 400TC Egyptian cotton satin bedsheet set featuring rich emerald & gold weaves.',
    ctaPrimary: 'Shop Emerald Set',
    ctaSecondary: 'View Bedsheets',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=2400&q=100&fit=crop&auto=format',
    link: '/shop?category=Bedsheets',
  },
  {
    tag: 'Deep Velvet Elegance',
    title: 'Sapphire Royal Blue Velvet Duvet Set',
    subtitle: 'Indulge in nightlong softness with our high-loft down-alternative microgel duvet enveloped in sapphire blue velvet.',
    ctaPrimary: 'Shop Sapphire Blue',
    ctaSecondary: 'View Comforters',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=2400&q=100&fit=crop&auto=format',
    link: '/shop?category=Comforters',
  },
  {
    tag: 'Winter Warmth Collection',
    title: 'Terracotta Gold Heavy Plush Blanket Set',
    subtitle: 'Stay warm through cold winter nights with ultra-soft double-ply Korean mink blankets in rich warm terracotta gold.',
    ctaPrimary: 'Shop Terracotta Blanket',
    ctaSecondary: 'View Blankets',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=2400&q=100&fit=crop&auto=format',
    link: '/shop?category=Blankets',
  },
]

const categories = [
  {
    name: 'Bedsheets',
    desc: 'Pure cotton, satin & digital prints',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Bedsheets',
  },
  {
    name: 'Comforters',
    desc: 'Heavy winter duvets & microgel quilts',
    image: 'https://images.unsplash.com/photo-1623944436679-5412c658a358?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Comforters',
  },
  {
    name: 'Blankets',
    desc: 'Double-ply mink & cozy fleece blankets',
    image: 'https://images.unsplash.com/photo-1619459074324-33d5f591c53e?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Blankets',
  },
  {
    name: 'Cushions',
    desc: 'Gold embroidered & velvet cushions',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Cushions',
  },
  {
    name: 'Collections',
    desc: 'Royal bridal & seasonal collections',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop',
  },
  {
    name: 'New Arrivals',
    desc: 'Fresh luxury styles, just landed',
    image: 'https://images.unsplash.com/photo-1685122121697-f4515ea401b0?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?badge=new',
  },
]

const collections = [
  { name: 'Royal Bridal Collection', tag: 'Velvet & Satin Heavy Sets', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=100&auto=format' },
  { name: 'Summer Cotton Collection', tag: 'Light & breathable', image: 'https://images.unsplash.com/photo-1606796913825-2b02883605e9?w=1200&h=800&fit=crop&q=100&auto=format' },
  { name: 'Winter Mink Collection', tag: 'Warm & cozy', image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=1200&h=800&fit=crop&q=100&auto=format' },
]

const reviewsData = [
  {
    name: 'Ayesha Khan',
    city: 'Lahore',
    rating: 5,
    title: 'Extremely Soft & High Quality!',
    text: 'I ordered the Ruby Red & Gold Heavy Bridal Set for my wedding trousseau and I am blown away by the quality. The embroidery is so detailed and royal!',
    product: 'Ruby Red & Gold Heavy Bridal Set',
    date: '2 days ago',
    avatar: 'AK',
  },
  {
    name: 'Dr. Shahzaib Khan',
    city: 'Islamabad',
    rating: 5,
    title: 'Super Soft Cotton Satin',
    text: 'The 300 Thread Count digital printed bedsheet set exceeded expectations. High color fastness even after multiple washes, feels like a 5-star hotel bed.',
    product: 'Digital Printed Cotton Satin Set',
    date: '4 days ago',
    avatar: 'SK',
  },
  {
    name: 'Zainab Malik',
    city: 'Karachi',
    rating: 5,
    title: 'Warm & Heavy Mink Blanket',
    text: 'Plush Korean Double Ply Mink Blanket is extremely warm during Karachi winter nights. Double-sided embossed design looks regal and elegant.',
    product: 'Plush Korean Double Ply Blanket',
    date: '1 week ago',
    avatar: 'ZM',
  },
  {
    name: 'Hamza Chaudhry',
    city: 'Faisalabad',
    rating: 5,
    title: 'Elegant Woven Jacquard',
    text: 'The Champagne Jacquard Bedspread gives our master bedroom a royal touch. The fabric sheen is subtle, premium, and durable.',
    product: 'Luxury Jacquard Bedsheet Set',
    date: '1 week ago',
    avatar: 'HC',
  },
  {
    name: 'Fatima Raza',
    city: 'Rawalpindi',
    rating: 5,
    title: 'Beautiful Embroidery & Finishing',
    text: 'The geometric gold embroidered cushion covers transformed my living room completely. Very impressed with HK Fabric’s attention to detail and premium packaging.',
    product: 'Geometric Gold Embroidered Cushions',
    date: '2 weeks ago',
    avatar: 'FR',
  },
  {
    name: 'Bilal Mustafa',
    city: 'Multan',
    rating: 5,
    title: 'Fast 48-Hour Delivery!',
    text: 'Ordered from Multan and received delivery within 48 hours. Beautiful branded box packaging with zero damage. Will definitely order again.',
    product: 'Maroon Velvet Heavy Bridal Set',
    date: '2 weeks ago',
    avatar: 'BM',
  },
  {
    name: 'Mahnoor Tariq',
    city: 'Sialkot',
    rating: 5,
    title: 'Emerald Royal Printed Set',
    text: 'Deep emerald color looks stunning in real life. No shrinkage after cold machine wash, stitching is very neat and high quality.',
    product: 'Emerald Royal Printed Bedsheet',
    date: '3 weeks ago',
    avatar: 'MT',
  },
  {
    name: 'Usman Farooq',
    city: 'Peshawar',
    rating: 5,
    title: 'Premium Winter Duvet Set',
    text: 'Indigo Floral Winter Duvet Cover set keeps us cozy all night. Microfiber filling feels like sleeping on clouds!',
    product: 'Indigo Floral Winter Duvet Set',
    date: '1 month ago',
    avatar: 'UF',
  },
]

const trustItems = [
  {
    icon: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
    label: 'FREE DELIVERY',
    sub: 'All over Pakistan',
  },
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    label: 'PREMIUM QUALITY',
    sub: '100% Guaranteed',
  },
  {
    icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    label: 'EASY RETURNS',
    sub: '15-day policy',
  },
  {
    icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    label: 'SECURE PAYMENT',
    sub: 'Easypaisa & cards',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [liveProducts, setLiveProducts] = useState<Product[]>(products)
  const [liveCategories, setLiveCategories] = useState(categories)
  const [liveCollections, setLiveCollections] = useState(collections)

  // Fetch live products, categories & collections from NestJS REST API and sync in real-time without page refresh
  useEffect(() => {
    let isMounted = true

    async function loadAPIData() {
      try {
        const [res, catRes, colRes] = await Promise.all([
          fetchProductsFromAPI(),
          fetchCategoriesFromAPI(),
          fetchCollectionsFromAPI(),
        ])

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

          const existingIds = new Set(mapped.map(m => m.id))
          const nonDuplicateFallback = products.filter(fp => !existingIds.has(fp.id))
          setLiveProducts([...mapped, ...nonDuplicateFallback])
        }

        if (catRes && Array.isArray(catRes) && catRes.length > 0 && isMounted) {
          setLiveCategories(catRes.map((c: any) => ({
            name: c.name,
            desc: c.description || 'Pure cotton, satin & digital prints',
            image: c.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=1000&fit=crop&q=100&auto=format',
            to: `/shop?category=${encodeURIComponent(c.name)}`,
          })))
        }

        if (colRes && Array.isArray(colRes) && colRes.length > 0 && isMounted) {
          setLiveCollections(colRes.map((c: any) => ({
            name: c.name,
            tag: c.description || 'Curated Special Collection',
            image: c.image || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=100&auto=format',
          })))
        }
      } catch (err) {
        console.warn('Backend API connection pending or offline, fallback to store state:', err)
      }
    }

    loadAPIData()

    // 1. Fast auto-polling every 1.5 seconds for instant zero-refresh updates
    const intervalId = setInterval(loadAPIData, 1500)

    // 2. Window focus refetching
    const handleFocus = () => loadAPIData()
    window.addEventListener('focus', handleFocus)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Professional GSAP ScrollTrigger Animations (Safe Target Execution)
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const safeFromTo = (selector: string, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => {
        if (document.querySelectorAll(selector).length > 0) {
          gsap.fromTo(selector, fromVars, toVars)
        }
      }

      // 1. Trust Items
      safeFromTo(
        '.gsap-trust-item',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-trust-section', start: 'top 88%' },
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 2. Category Showcase Cards
      safeFromTo(
        '.gsap-category-card',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-category-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 3. Catalog Section Title & Header
      safeFromTo(
        '.gsap-catalog-header',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-catalog-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 4. Category Tabs
      safeFromTo(
        '.gsap-category-tab',
        { opacity: 0, y: 15 },
        {
          scrollTrigger: { trigger: '.gsap-catalog-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 5. Product Grid Initial Animation
      safeFromTo(
        '.gsap-product-card',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-product-grid', start: 'top 88%' },
          opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 6. Promo Banner
      safeFromTo(
        '.gsap-promo-content',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-promo-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 7. Featured Collections
      safeFromTo(
        '.gsap-collection-card',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-collections-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 8. Testimonial Reviews Section
      safeFromTo(
        '.gsap-reviews-section',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-reviews-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all'
        }
      )

      // 9. Story Section Text & Image
      safeFromTo(
        '.gsap-story-text',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-story-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all'
        }
      )

      safeFromTo(
        '.gsap-story-img',
        { opacity: 0, y: 25 },
        {
          scrollTrigger: { trigger: '.gsap-story-section', start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', clearProps: 'all'
        }
      )
    })

    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => ctx.revert()
  }, [])

  // Animate product cards smoothly on tab switch (pure opacity fade, zero layout shift)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const cards = document.querySelectorAll('.gsap-product-card')
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, stagger: 0.02, ease: 'power1.out', clearProps: 'all' }
      )
    }
  }, [selectedCategory])

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)

  const categoryTabs = [
    { id: 'All', label: 'All Products', count: liveProducts.length },
    { id: 'Bedsheets', label: 'Bedsheets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'bedsheets').length },
    { id: 'Comforters', label: 'Comforters', count: liveProducts.filter(p => p.category?.toLowerCase() === 'comforters').length },
    { id: 'Blankets', label: 'Blankets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'blankets').length },
    { id: 'Cushions', label: 'Cushions', count: liveProducts.filter(p => p.category?.toLowerCase() === 'cushions').length },
  ]

  const displayedProducts = selectedCategory === 'All'
    ? liveProducts
    : liveProducts.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <main>
      {/* Hero Animated Slider Banner (4 Vibrant Eye-Catching Slides) */}
      <section className="relative h-[340px] sm:h-[480px] lg:h-[620px] overflow-hidden bg-[#111111] group">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center"
            />

            {/* Crisp subtle overlay gradient for crystal clear image detail */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl text-white">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 sm:mb-4 font-semibold">
                    {slide.tag}
                  </p>
                  <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-500 text-white leading-tight mb-2 sm:mb-5 drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-white/85 text-xs sm:text-base leading-relaxed mb-4 sm:mb-8 max-w-md line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    <Link href={slide.link} className="btn-gold px-5 sm:px-8 py-2.5 sm:py-3.5 text-[10px] sm:text-[11px] tracking-widest uppercase inline-block shadow-lg rounded-lg">
                      {slide.ctaPrimary}
                    </Link>
                    <Link href="/shop" className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 text-[10px] sm:text-[11px] tracking-widest uppercase font-semibold border border-white/80 text-white hover:bg-white hover:text-[#111111] transition-colors rounded-lg">
                      {slide.ctaSecondary}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-[#111111] text-lg sm:text-xl"
          aria-label="Previous Slide"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-[#111111] text-lg sm:text-xl"
          aria-label="Next Slide"
        >
          ›
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 sm:w-8 bg-[#D4AF37]' : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust / Service Bar */}
      <section className="gsap-trust-section bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-[#E8E5DE]">
            {trustItems.map((item, i) => (
              <div key={i} className="gsap-trust-item flex items-center gap-2.5 sm:gap-3 py-4 sm:py-5 px-3 sm:px-6 border-r border-b lg:border-b-0 border-[#E8E5DE]">
                <svg width="20" height="20" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24" className="shrink-0">
                  {item.icon}
                </svg>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#111111] uppercase tracking-wide">{item.label}</p>
                  <p className="text-[9px] sm:text-[10px] text-[#6B6B6B] mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category Quick Grid */}
      <section className="gsap-category-section py-10 sm:py-14 bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 sm:mb-2 font-semibold">Explore Categories</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">Browse By Category</h2>
            </div>
            <Link href="/shop" className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#D4AF37] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-0.5">
              View All Shop →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {liveCategories.map(cat => (
              <div key={cat.name} className="gsap-category-card">
                <Link href={cat.to} className="group relative overflow-hidden bg-[#F8F7F3] aspect-[3/4] rounded-xl shadow-xs hover:shadow-md transition-shadow block">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="font-serif text-white text-base sm:text-lg font-500 leading-tight">{cat.name}</h3>
                    <p className="text-white/80 text-[9px] sm:text-[10px] mt-0.5">{cat.desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS FROM ALL CATEGORIES SECTION */}
      <section className="gsap-catalog-section py-12 sm:py-18 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="gsap-catalog-header text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-semibold">Our Complete Catalog</p>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-500 text-[#111111] mb-3">
              Explore All Products
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B]">
              Discover our complete collection of handcrafted bridal sets, Egyptian cotton bedsheets, microgel comforters, Korean mink blankets, and designer accent cushions.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 mb-8 sm:mb-12">
            {categoryTabs.map(tab => {
              const isActive = selectedCategory === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`gsap-category-tab px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-[#D4AF37] border-2 border-[#111111] shadow-md'
                      : 'bg-[#F4F3EE] text-[#111111] border-2 border-[#D0CCC0] hover:bg-[#111111] hover:text-[#D4AF37] hover:border-[#111111]'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#D4AF37] text-[#111111]' : 'bg-[#E0DDD3] text-[#111111]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Product Grid (Displays all 18 products when 'All' is selected) */}
          <div className="gsap-product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 gap-y-6 sm:gap-y-8 items-stretch">
            {displayedProducts.map(p => (
              <div key={p.id} className="gsap-product-card h-full">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Showing Count Footer */}
          <div className="mt-10 sm:mt-14 text-center">
            <p className="text-xs text-[#6B6B6B] mb-3">
              Showing <span className="font-bold text-[#111111]">{displayedProducts.length}</span> of <span className="font-bold text-[#111111]">{liveProducts.length}</span> total luxury products
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="inline-block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold border-b border-[#D4AF37] pb-0.5 hover:text-[#111111] hover:border-[#111111] transition-colors"
              >
                View All Categories ({liveProducts.length} Products) →
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Promotional Banner */}
      <section className="gsap-promo-section relative overflow-hidden bg-[#111111] sm:rounded-2xl mx-0 sm:mx-4 lg:mx-8 my-6">
        <img
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&h=500&fit=crop&auto=format"
          alt="Sale on premium home textiles"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="gsap-promo-content relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="max-w-lg">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 sm:mb-4 font-semibold">Limited Time Offer</p>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-500 text-white leading-none mb-2">Up to 30% Off</h2>
            <p className="text-white/80 text-xs sm:text-lg mb-6 sm:mb-8">On selected bedsheets, comforters & blankets</p>
            <Link href="/shop?sale=true" className="btn-gold inline-block px-6 sm:px-10 py-3 sm:py-4 text-[10px] sm:text-[11px] tracking-widest uppercase rounded-lg">
              Shop Sale Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="gsap-collections-section py-10 sm:py-16 lg:py-24 bg-[#F8F7F3]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 font-semibold">Curated</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">Featured Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {liveCollections.map(col => (
              <div key={col.name} className="gsap-collection-card">
                <Link href="/shop" className="group relative overflow-hidden bg-[#E8E5DE] aspect-video md:aspect-[4/3] rounded-xl shadow-xs block">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] mb-1 font-semibold">{col.tag}</p>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-500">{col.name}</h3>
                    <span className="inline-block mt-1 sm:mt-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-white/80 font-semibold border-b border-white/40 pb-0.5 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                      Explore →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section (Continuous Auto-Sliding Marquee Carousel) */}
      <section className="gsap-reviews-section py-12 sm:py-18 lg:py-24 bg-white border-t border-[#E8E5DE] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Testimonials & Reviews
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">What Our Customers Say</h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">Real reviews from verified buyers across Pakistan</p>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F7F3] border border-[#E8E5DE] px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xs">
              <div className="flex text-[#D4AF37] tracking-tight text-sm">
                ★★★★★
              </div>
              <span className="text-[#111111] font-bold">4.9 / 5.0</span>
              <span className="text-[#6B6B6B] text-[11px]">(500+ Reviews)</span>
            </div>
          </div>
        </div>

        {/* Continuous Infinite Auto-Sliding Marquee Track */}
        <div className="w-full overflow-hidden py-4">
          {/* Marquee Track (Continuous infinite loop over 8 reviews x 2) */}
          <div className="animate-marquee-continuous flex gap-5">
            {[...reviewsData, ...reviewsData].map((rev, i) => (
              <div
                key={i}
                className="w-[290px] sm:w-[360px] shrink-0 bg-[#F8F7F3] border border-[#E8E5DE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#D4AF37]">
                      {[...Array(rev.rating)].map((_, s) => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-semibold bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg width="9" height="9" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Verified Buyer
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-semibold text-[#111111] mb-1.5 leading-snug">"{rev.title}"</h4>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">{rev.text}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-3 truncate">
                    Purchased: {rev.product}
                  </p>

                  <div className="pt-3 border-t border-[#E8E5DE] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#111111] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center border border-[#D4AF37]">
                        {rev.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#111111] leading-none">{rev.name}</p>
                        <p className="text-[10px] text-[#6B6B6B] mt-0.5">{rev.city}, PK</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#888] font-medium">{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Tip Indicator */}
        <div className="text-center mt-4">
          <p className="text-[10px] sm:text-[11px] text-[#888] tracking-widest uppercase font-medium flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            Hover over any review card to pause auto-sliding
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
          </p>
        </div>
      </section>

      {/* Brand Story Strip */}
      <section className="gsap-story-section bg-[#F8F7F3] border-t border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="gsap-story-text md:w-1/2">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">Our Story</p>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-500 text-[#111111] mb-3 leading-snug">
              Crafted with care,<br />made for your home
            </h2>
            <p className="text-[#6B6B6B] text-xs sm:text-sm leading-relaxed mb-5 max-w-md">
              Founded in Lahore, HK Fabric has been bringing premium home textiles to Pakistani households since 2018. Every thread is chosen with intention — for softness, durability, and beauty that lasts.
            </p>
            <Link href="/about" className="inline-block text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-[#111111] border-b border-[#111111] pb-0.5 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
              Learn More
            </Link>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-3 w-full">
            <img src="https://images.unsplash.com/photo-1614226114676-8e02ac5f4763?w=400&h=300&fit=crop&auto=format" alt="Premium fabric texture" className="gsap-story-img w-full h-32 sm:h-40 object-cover rounded-xl" />
            <img src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop&auto=format" alt="Fine textile weave" className="gsap-story-img w-full h-32 sm:h-40 object-cover mt-4 sm:mt-6 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  )
}


