const policy = {
  title: 'Return & Refund Policy',
  subtitle: 'Shop with confidence — returns made simple',
  sections: [
    { heading: '15-Day Return Window', body: 'We accept returns within 15 days of the delivery date. Products must be unused, unwashed, and in their original packaging with all tags attached.' },
    { heading: 'How to Initiate a Return', body: 'Email us at hello@hkfabric.pk with your order number and reason for return. Our team will respond within 24 hours with return instructions and a pre-paid shipping label where applicable.' },
    { heading: 'Non-Returnable Items', body: 'For hygiene reasons, the following cannot be returned: items that have been washed, used, or altered; items without original packaging or tags; sale or clearance items marked as "final sale".' },
    { heading: 'Refund Timeline', body: 'Once we receive and inspect your return (typically 2–3 business days after receipt), your refund will be processed within 3–5 business days. Refunds are credited to your original payment method.' },
    { heading: 'Damaged or Defective Items', body: 'If your item arrives damaged or defective, please contact us within 48 hours of delivery with clear photographs. We will arrange a replacement or full refund at no cost to you — no need to return the item.' },
    { heading: 'Exchanges', body: 'We do not offer direct exchanges. If you need a different size or colour, please return the original item and place a new order. This ensures the fastest turnaround for you.' },
  ],
}

export default function ReturnPolicy() {
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
