const policy = {
  title: 'Terms & Conditions',
  subtitle: 'Please read these terms carefully before using our website',
  sections: [
    { heading: 'Acceptance of Terms', body: 'By accessing and using the HK Fabric website, you agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our website or services.' },
    { heading: 'Product Information', body: 'We make every effort to display our products accurately. Colours may vary slightly due to screen display settings. Prices are displayed in Pakistani Rupees (PKR) and are subject to change without notice.' },
    { heading: 'Order Acceptance', body: 'Placing an order does not constitute a binding contract. We reserve the right to cancel orders at our discretion (e.g., in case of stock unavailability, suspected fraud, or pricing errors). You will be notified and refunded promptly.' },
    { heading: 'Pricing', body: 'All prices are in Pakistani Rupees (Rs.) and inclusive of applicable taxes. Shipping is free on all orders. Prices are subject to change at any time. The price charged will be the price displayed at the time of order confirmation.' },
    { heading: 'Intellectual Property', body: 'All content on this website — including images, copy, logos, and design — is the property of HK Fabric and is protected by copyright law. Unauthorised use, reproduction, or distribution is strictly prohibited.' },
    { heading: 'Limitation of Liability', body: 'HK Fabric shall not be liable for any indirect, incidental, or consequential damages arising from use of our website or products beyond the original purchase price of the product.' },
    { heading: 'Governing Law', body: 'These terms are governed by the laws of Pakistan. Any disputes shall be subject to the jurisdiction of the courts of Lahore, Punjab, Pakistan.' },
  ],
}

export default function Terms() {
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
