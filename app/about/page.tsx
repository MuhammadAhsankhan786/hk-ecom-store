import Link from 'next/link'

export default function About() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-[#111111] text-white py-20 lg:py-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1644955052489-10bda5c94b19?w=1600&h=600&fit=crop&auto=format"
          alt="HK Fabric workshop"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3">Our Story</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-500 mb-4">Crafting Comfort Since 2018</h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
            HK Fabric was founded with a single mission: to bring luxurious, durable, and beautifully designed home textiles to every Pakistani household.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-16">
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2">Quality First</p>
            <h2 className="font-serif text-2xl lg:text-3xl font-500 text-[#111111] mb-4 leading-snug">
              Every thread tells a story of craftsmanship
            </h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
              From our flagship store in Lahore to homes across Pakistan, HK Fabric stands for uncompromising quality. We source the finest long-staple cotton and premium Jacquard weaves to ensure our bedding stays soft, smooth, and vibrant wash after wash.
            </p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Our digital printing techniques use eco-friendly dyes that penetrate deep into the fibers, producing rich, fade-resistant patterns that elevate any bedroom decor.
            </p>
          </div>
          <div className="bg-[#F8F7F3] aspect-4/3 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1614226114676-8e02ac5f4763?w=700&h=525&fit=crop&auto=format" alt="Fabric weaving details" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-[#E8E5DE] text-center">
          {[
            ['50,000+', 'Happy Customers'],
            ['100%', 'Pure Cotton Grace'],
            ['15-Day', 'Easy Returns'],
            ['3-5 Days', 'Nationwide Delivery'],
          ].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="font-serif text-3xl lg:text-4xl font-500 text-[#111111] mb-1">{val}</p>
              <p className="text-xs text-[#6B6B6B] uppercase tracking-wider">{lbl}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <div className="text-center max-w-md mx-auto mb-12">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2">Our Promise</p>
            <h2 className="font-serif text-3xl font-500 text-[#111111]">Why Choose HK Fabric</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Authentic Materials', body: 'We use 100% pure cotton, silk satin, and premium microfiber fills. No harsh chemicals or synthetic shortcuts.' },
              { title: 'Thoughtful Design', body: 'Our design team in Lahore creates patterns inspired by both classic oriental artistry and modern minimalist aesthetics.' },
              { title: 'Nationwide Trust', body: 'With free shipping across Pakistan and dedicated customer care, we make luxury home styling accessible to all.' },
            ].map(v => (
              <div key={v.title} className="bg-[#F8F7F3] p-8">
                <div className="w-8 h-0.5 bg-[#D4AF37] mb-4" />
                <h3 className="font-serif text-lg font-500 text-[#111111] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#111111] text-white p-10 lg:p-14 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-500 mb-3">Ready to transform your bedroom?</h2>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">Explore our range of premium bedsheets, comforters, and blankets with free delivery nationwide.</p>
          <Link href="/shop" className="btn-gold inline-block px-8 py-3.5 text-[10px] uppercase tracking-widest">
            Shop Collections
          </Link>
        </div>
      </div>
    </main>
  )
}
