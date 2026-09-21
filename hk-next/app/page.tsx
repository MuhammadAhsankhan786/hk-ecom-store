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
    tag: 'Luxury Floral Embroidery',
    title: 'Classic Cream & Gold Hand-Embroidered Bedding',
    subtitle: 'Comfort in Every Thread — Indulge in premium Egyptian cotton featuring intricate floral embroidery and luxury matching pillowcases.',
    ctaPrimary: 'Shop Embroidered Set',
    ctaSecondary: 'View Bedsheets',
    image: '/images/hero/hero-slide-1.jpg',
    link: '/shop?category=Embroidery%20Bedsheets',
  },
  {
    tag: 'Royal Pakistani Bridal Collection',
    title: 'Elegance for a Lifetime — Heavy Velvet Bridal Trousseau',
    subtitle: 'Make your wedding trousseau royal with our embroidered cream & maroon velvet 10-piece bridal set crafted with gold zari embroidery.',
    ctaPrimary: 'Shop Royal Bridal Set',
    ctaSecondary: 'View Bridal Collections',
    image: '/images/hero/hero-slide-2.jpg',
    link: '/shop?category=Comforter%20Set%20Bridal%209%20Pieces',
  },
  {
    tag: 'Grand Bridal Series',
    title: 'For Your Most Beautiful Beginning — Gold & Crimson Set',
    subtitle: 'Experience unmatched grandeur with rich crimson velvet trim, intricate gold floral motifs, and royal satin pillow shams.',
    ctaPrimary: 'Shop Crimson Bridal',
    ctaSecondary: 'View Bedcovers',
    image: '/images/hero/hero-slide-3.jpg',
    link: '/shop?category=Bridal%20Bedcover%208%20Pieces%20Set',
  },
  {
    tag: 'Summer Cotton Collection',
    title: 'Light. Breathable. Beautiful. For Brighter, Cooler Days.',
    subtitle: 'Stay cool through warm summer nights with 100% pure combed cotton bedsheets adorned with soft sage green botanical prints.',
    ctaPrimary: 'Shop Summer Cotton',
    ctaSecondary: 'View Cotton Sheets',
    image: '/images/hero/hero-slide-4.jpg',
    link: '/shop?category=Cotton%20Bedsheets',
  },
  {
    tag: 'Winter Mink Collection',
    title: 'Warmer. Cozier. Happier Together — Charcoal Plush Mink',
    subtitle: 'Wrap yourself in ultimate winter warmth with our heavy double-ply plush mink blanket set featuring embossed botanical leaves.',
    ctaPrimary: 'Shop Winter Mink',
    ctaSecondary: 'View Blankets',
    image: '/images/hero/hero-slide-5.jpg',
    link: '/shop?category=Fleece%20Summer%20Blankets',
  },
]

const categories = [
  {
    name: 'Single Bedsheets',
    desc: 'Single size Egyptian cotton bedsheets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789893914/categories/vp2ikxstcfc3ezvxlqmy.png',
    to: `/shop?category=${encodeURIComponent('Single Bedsheets')}`,
  },
  {
    name: 'Jacquard Bedsheets',
    desc: 'Woven champagne & gold royal Jacquard bedsheet sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789894013/categories/gze4yabunwvv9glyobxz.png',
    to: `/shop?category=${encodeURIComponent('Jacquard Bedsheets')}`,
  },
  {
    name: 'Velvet Bedsheets',
    desc: 'Plush Dutch velvet luxury bedsheet sets for winter',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789894106/categories/gbsoarfmffxjtzwqg8yt.png',
    to: `/shop?category=${encodeURIComponent('Velvet Bedsheets')}`,
  },
  {
    name: 'Embroidery Bedsheets',
    desc: 'Intricate machine & hand-embroidered luxury bedsheets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789894197/categories/dxhh4tjd4gdsyyrha2hj.png',
    to: `/shop?category=${encodeURIComponent('Embroidery Bedsheets')}`,
  },
  {
    name: 'Medicated Pillows',
    desc: 'Orthopedic & ergonomic neck-support medicated pillows',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789899265/categories/jvyyelm5vlrlzutdayt4.png',
    to: `/shop?category=${encodeURIComponent('Medicated Pillows')}`,
  },
  {
    name: 'Imported Bedspreads',
    desc: 'Premium imported quilted & woven bedspreads',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800',
    to: `/shop?category=${encodeURIComponent('Imported Bedspreads')}`,
  },
  {
    name: 'Double Bedsheets',
    desc: 'Double size Egyptian cotton bedsheets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789893815/categories/bqjm5wdr7j3wkzfoeset.png',
    to: `/shop?category=${encodeURIComponent('Double Bedsheets')}`,
  },
  {
    name: 'Export Quality Bedsheets',
    desc: 'Export quality combed cotton bedsheet sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789893589/categories/nw71c53p8jydpzgteoql.png',
    to: `/shop?category=${encodeURIComponent('Export Quality Bedsheets')}`,
  },
  {
    name: 'Towel & Towel Sets',
    desc: 'Ultra-soft combed cotton bath towel & hand towel sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789899377/categories/v4idypsam5gopf481aqq.png',
    to: `/shop?category=${encodeURIComponent('Towel & Towel Sets')}`,
  },
  {
    name: 'Bridal Bedcover 8 Pieces Set',
    desc: 'Luxury 8-piece embroidered bridal bedcover sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789899594/categories/qrdh7oomhfqozfexybqo.png',
    to: `/shop?category=${encodeURIComponent('Bridal Bedcover 8 Pieces Set')}`,
  },
  {
    name: 'Silk & Chenille Bridal Set',
    desc: 'Luxury satin silk & chenille bridal sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789892948/categories/wztryeme0bspd9b3rcui.png',
    to: `/shop?category=${encodeURIComponent('Silk & Chenille Bridal Set')}`,
  },
  {
    name: 'Velvet Bridal Set',
    desc: 'Royal velvet embroidered wedding sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789893086/categories/cso9drq2qbtj5rdgtxdy.png',
    to: `/shop?category=${encodeURIComponent('Velvet Bridal Set')}`,
  },
  {
    name: 'Fancy Zari Bridal Set',
    desc: 'Heavy gold zari embroidered royal bridal sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789893276/categories/sienqvllskubh8olcsgj.png',
    to: `/shop?category=${encodeURIComponent('Fancy Zari Bridal Set')}`,
  },
  {
    name: 'Cotton Bridal Set',
    desc: 'Pure cotton breathable bridal sets',
    image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789893440/categories/vwvwtpzvvwojizgtx8p2.png',
    to: `/shop?category=${encodeURIComponent('Cotton Bridal Set')}`,
  },
  {
    name: 'Comforter Set Bridal 9 Pieces',
    desc: 'Royal 9-piece embroidered bridal comforter sets with zari work',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800',
    to: `/shop?category=${encodeURIComponent('Comforter Set Bridal 9 Pieces')}`,
  },
  {
    name: 'Cotton Comforter & Comforter Sets',
    desc: '100% Cotton quilted comforters and microgel duvets',
    image: 'https://images.unsplash.com/photo-1614226114676-8e02ac5f4763?auto=format&fit=crop&w=800',
    to: `/shop?category=${encodeURIComponent('Cotton Comforter & Comforter Sets')}`,
  },
  {
    name: 'Fleece Summer Blankets',
    desc: 'Lightweight breathable fleece blankets for summer & AC comfort',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800',
    to: `/shop?category=${encodeURIComponent('Fleece Summer Blankets')}`,
  },
]

const collections = [
  { name: 'Royal Bridal Collection', tag: 'Velvet & Satin Heavy Sets with gold zari embroidery', image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789898682/collections/tsd3r5igyv8dq8iqj9kn.png' },
  { name: 'Summer Cotton Collection', tag: 'Light & breathable 100% Egyptian cotton sheets', image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789898831/collections/hxe08evt6wvhcep4jq2p.png' },
  { name: 'Winter Mink Collection', tag: 'Warm & cozy double-ply Korean mink plush blankets', image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789898934/collections/obfn6cwswl6dlt2ayygq.png' },
  { name: 'Bridal Collection', tag: 'Royal bridal sets with heavy embroidery', image: 'http://res.cloudinary.com/dhpqigvzj/image/upload/v1789899077/collections/yhhwmx7nml5tc7xourch.png' },
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
  const [liveProducts, setLiveProducts] = useState<Product[]>([])
  const [liveCategories, setLiveCategories] = useState<any[]>(categories)
  const [liveCollections, setLiveCollections] = useState<any[]>(collections)

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

          setLiveProducts(mapped)
        }

        if (catRes && Array.isArray(catRes) && catRes.length > 0 && isMounted) {
          setLiveCategories(catRes.map((c: any) => {
            const staticMatch = categories.find(sc => sc.name.toLowerCase() === c.name?.toLowerCase())
            return {
              name: c.name,
              desc: c.description || staticMatch?.desc || 'Pure cotton, satin & digital prints',
              image: (c.image && c.image.trim().length > 0) ? c.image : (staticMatch?.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=1000&fit=crop&q=100&auto=format'),
              to: `/shop?category=${encodeURIComponent(c.name)}`,
            }
          }))
        }

        if (colRes && Array.isArray(colRes) && colRes.length > 0 && isMounted) {
          setLiveCollections(colRes.map((c: any) => {
            const staticMatch = collections.find(sc => sc.name.toLowerCase() === c.name?.toLowerCase())
            return {
              name: c.name,
              tag: c.description || staticMatch?.tag || 'Curated Special Collection',
              image: (c.image && c.image.trim().length > 0) ? c.image : (staticMatch?.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&h=800&fit=crop&q=100&auto=format'),
            }
          }))
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
    { id: 'Comforter Set Bridal 9 Pieces', label: 'Bridal 9 Pcs', count: liveProducts.filter(p => p.category?.toLowerCase() === 'comforter set bridal 9 pieces').length },
    { id: 'Bridal Bedcover 8 Pieces Set', label: 'Bridal Bedcover 8 Pcs', count: liveProducts.filter(p => p.category?.toLowerCase() === 'bridal bedcover 8 pieces set').length },
    { id: 'Towel & Towel Sets', label: 'Towel Sets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'towel & towel sets').length },
    { id: 'Fleece Summer Blankets', label: 'Summer Blankets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'fleece summer blankets').length },
    { id: 'Cotton Comforter & Comforter Sets', label: 'Cotton Comforters', count: liveProducts.filter(p => p.category?.toLowerCase() === 'cotton comforter & comforter sets').length },
    { id: 'Cotton Bedsheets', label: 'Cotton Bedsheets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'cotton bedsheets').length },
    { id: 'Imported Bedspreads', label: 'Bedspreads', count: liveProducts.filter(p => p.category?.toLowerCase() === 'imported bedspreads').length },
    { id: 'Medicated Pillows', label: 'Medicated Pillows', count: liveProducts.filter(p => p.category?.toLowerCase() === 'medicated pillows').length },
    { id: 'Embroidery Bedsheets', label: 'Embroidery Sheets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'embroidery bedsheets').length },
    { id: 'Velvet Bedsheets', label: 'Velvet Sheets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'velvet bedsheets').length },
    { id: 'Jacquard Bedsheets', label: 'Jacquard Sheets', count: liveProducts.filter(p => p.category?.toLowerCase() === 'jacquard bedsheets').length },
  ]

  const displayedProducts = selectedCategory === 'All'
    ? liveProducts
    : liveProducts.filter(p => {
        const catLower = p.category?.toLowerCase() || ''
        const targetLower = selectedCategory.toLowerCase()
        if (catLower === targetLower) return true
        const subMap: Record<string, string[]> = {
          'cotton bedsheets': ['single bedsheets', 'double bedsheets', 'export quality bedsheets'],
          'comforter set bridal 9 pieces': ['cotton bridal set', 'fancy zari bridal set', 'velvet bridal set', 'silk & chenille bridal set'],
          'fleece summer blankets': ['single fleece blanket', 'double fleece blanket', 'heavy mink blanket'],
          'cotton comforter & comforter sets': ['6-piece comforter set', '4-piece comforter set', 'king size duvet set'],
        }
        const allowedSubs = subMap[targetLower] || []
        return allowedSubs.includes(catLower)
      })

  return (
    <main>
      {/* Flagship Hero Banner with Overlaid Interactive Category Cards Grid */}
      <section className="relative bg-[#111111] overflow-hidden">
        {/* Main Background Image Slider */}
        <div className="relative min-h-[580px] lg:min-h-[660px] flex items-center">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
            </div>
          ))}

          {/* Hero Main Content Container */}
          <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
            {/* Top Text & Heading */}
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-4 font-semibold backdrop-blur-xs">
                <span>✨ HK FABRIC PAKISTAN</span>
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                <span>OFFICIAL STORE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-500 text-white leading-[1.15] mb-4 drop-shadow-lg">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl mb-8 drop-shadow-md">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <Link
                  href={heroSlides[currentSlide].link}
                  className="btn-gold px-7 sm:px-9 py-3.5 sm:py-4 text-xs tracking-widest uppercase rounded-xl font-bold shadow-xl hover:scale-103 transition-transform"
                >
                  {heroSlides[currentSlide].ctaPrimary} →
                </Link>
                <Link
                  href="/shop"
                  className="px-7 sm:px-9 py-3.5 sm:py-4 text-xs tracking-widest uppercase rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-colors"
                >
                  {heroSlides[currentSlide].ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/3 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 text-white border border-white/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#111111] transition-colors cursor-pointer"
          aria-label="Previous Slide"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/3 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 text-white border border-white/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#111111] transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          ›
        </button>

        {/* Slide Progress Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/40 hover:bg-white/80'}`}
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


