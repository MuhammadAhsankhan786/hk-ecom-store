'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '../src/components/ProductCard'
import { products } from '../src/data/products'

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
    image: 'https://images.unsplash.com/photo-1639690222869-1e608aa51f82?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Bedsheets',
  },
  {
    name: 'Comforters',
    desc: 'All-season & winter warmth',
    image: 'https://images.unsplash.com/photo-1623944436679-5412c658a358?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Comforters',
  },
  {
    name: 'Blankets',
    desc: 'Cashmere blends & cozy weaves',
    image: 'https://images.unsplash.com/photo-1619459074324-33d5f591c53e?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Blankets',
  },
  {
    name: 'Cushions',
    desc: 'Decorative & accent pieces',
    image: 'https://images.unsplash.com/photo-1685122121706-a7d632dec1df?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop?category=Cushions',
  },
  {
    name: 'Collections',
    desc: 'Curated seasonal sets',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=1000&fit=crop&q=100&auto=format',
    to: '/shop',
  },
  {
    name: 'New Arrivals',
    desc: 'Fresh styles, just landed',
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
    product: 'Ruby Red & Gold Heavy Bridal Bedding Set',
    date: '3 days ago',
  },
  {
    name: 'Zainab Malik',
    city: 'Karachi',
    rating: 5,
    title: 'Best Comforter in Pakistan',
    text: 'Fast 2-day delivery to Karachi! The Royal Indigo Winter Duvet is super warm, lightweight and feels like sleeping in a 5-star luxury hotel. Worth every rupee.',
    product: 'Royal Indigo Heavy Winter Duvet',
    date: '1 week ago',
  },
  {
    name: 'Fatima Raza',
    city: 'Islamabad',
    rating: 5,
    title: 'Beautiful Embroidery & Finishing',
    text: 'The geometric gold embroidered cushion covers transformed my living room completely. Very impressed with HK Fabric’s attention to detail and premium packaging.',
    product: 'Geometric Gold Embroidered Cushions',
    date: '2 weeks ago',
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)

  const bestSellers = products.slice(0, 4)

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
      <section className="bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-[#E8E5DE]">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 sm:gap-3 py-4 sm:py-5 px-3 sm:px-6 border-r border-b lg:border-b-0 border-[#E8E5DE]">
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

      {/* Shop by Category */}
      <section className="py-10 sm:py-16 lg:py-24 bg-[#F8F7F3]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 sm:mb-2 font-semibold">Explore</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">Shop by Category</h2>
            </div>
            <Link href="/shop" className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#D4AF37] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-0.5">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {categories.map(cat => (
              <Link key={cat.name} href={cat.to} className="group relative overflow-hidden bg-[#F8F7F3] aspect-[3/4] rounded-xl shadow-xs hover:shadow-md transition-shadow">
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
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 sm:mb-2 font-semibold">Top Picks</p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">Best Sellers</h2>
            </div>
            <Link href="/shop" className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#D4AF37] transition-colors border-b border-transparent hover:border-[#D4AF37] pb-0.5">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 gap-y-6 sm:gap-y-8">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="relative overflow-hidden bg-[#111111] sm:rounded-2xl mx-0 sm:mx-4 lg:mx-8">
        <img
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&h=500&fit=crop&auto=format"
          alt="Sale on premium home textiles"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
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
      <section className="py-10 sm:py-16 lg:py-24 bg-[#F8F7F3]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 font-semibold">Curated</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">Featured Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {collections.map(col => (
              <Link key={col.name} href="/shop" className="group relative overflow-hidden bg-[#E8E5DE] aspect-video md:aspect-[4/3] rounded-xl shadow-xs">
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
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 sm:py-18 lg:py-24 bg-white border-t border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">Testimonials</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-500 text-[#111111]">What Our Customers Say</h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 max-w-md mx-auto">Real reviews from verified buyers across Pakistan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {reviewsData.map((rev, i) => (
              <div key={i} className="bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-sm">
                      Verified Buyer
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#111111] mb-2">"{rev.title}"</h4>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">{rev.text}</p>
                </div>

                <div className="pt-4 border-t border-[#E8E5DE] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#111111]">{rev.name}</p>
                    <p className="text-[10px] text-[#6B6B6B]">{rev.city}, Pakistan</p>
                  </div>
                  <span className="text-[10px] text-[#888]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Strip */}
      <section className="bg-[#F8F7F3] border-t border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="md:w-1/2">
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
            <img src="https://images.unsplash.com/photo-1614226114676-8e02ac5f4763?w=400&h=300&fit=crop&auto=format" alt="Premium fabric texture" className="w-full h-32 sm:h-40 object-cover rounded-xl" />
            <img src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop&auto=format" alt="Fine textile weave" className="w-full h-32 sm:h-40 object-cover mt-4 sm:mt-6 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  )
}
