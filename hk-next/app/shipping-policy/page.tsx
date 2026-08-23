import Link from 'next/link'

const policy = {
  title: 'Shipping Policy',
  subtitle: 'Everything you need to know about how we deliver your order',
  sections: [
    { heading: 'Free Delivery Across Pakistan', body: 'HK Fabric offers free standard delivery on all orders, with no minimum purchase required. We ship to all cities and towns across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and beyond.' },
    { heading: 'Delivery Timeframes', body: 'Standard delivery takes 3–5 business days for major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad). Remote or rural areas may require 5–7 business days. Business days exclude weekends and public holidays.' },
    { heading: 'Order Processing', body: 'Orders are typically processed within 24 hours of confirmed payment. You will receive an email and SMS confirmation once your order is confirmed, and a separate notification with tracking details once it is dispatched.' },
    { heading: 'Order Tracking', body: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can also monitor your order status in real time through your HK Fabric account under "My Orders".' },
    { heading: 'Delivery Partners', body: 'We partner with reputable courier services including TCS, Leopards, and M&P for reliable nationwide delivery. Courier selection is based on your delivery location and availability.' },
    { heading: 'Failed Delivery Attempts', body: "If delivery is unsuccessful after two attempts, the package will be held at the courier's facility for 5 days. After this period, it will be returned to us. Please ensure your contact details and delivery address are accurate." },
  ],
}

export default function ShippingPolicy() {
  return (
    <main className="bg-white min-h-screen">
      <div className="bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2">Legal</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-500 text-[#111111]">{policy.title}</h1>
          <p className="text-sm text-[#6B6B6B] mt-2">{policy.subtitle}</p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <p className="text-xs text-[#6B6B6B] mb-10 pb-6 border-b border-[#E8E5DE]">Last updated: 1 August 2025</p>
        <div className="space-y-8">
          {policy.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-serif text-lg font-500 text-[#111111] mb-3">
                <span className="text-[#D4AF37] mr-2">{i + 1}.</span>{s.heading}
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E5DE]">
          <p className="text-sm text-[#6B6B6B]">
            Questions about this policy? Contact us at{' '}
            <a href="mailto:hello@hkfabric.pk" className="text-[#111111] font-medium hover:text-[#D4AF37] transition-colors">hello@hkfabric.pk</a>
          </p>
        </div>
      </div>
    </main>
  )
}
