const policy = {
  title: 'Privacy Policy',
  subtitle: 'How we collect, use and protect your personal information',
  sections: [
    { heading: 'Information We Collect', body: 'We collect information you provide directly to us when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, delivery address, and payment information. We also collect usage data such as pages visited and products viewed.' },
    { heading: 'How We Use Your Information', body: 'We use your information to process orders, provide customer support, send order updates and delivery notifications, personalise your shopping experience, and — with your consent — send marketing communications about new products and offers.' },
    { heading: 'Payment Information', body: 'All payment transactions are encrypted and processed securely via Easypaisa or our payment gateway partners. HK Fabric does not store your full card or bank account details on our servers.' },
    { heading: 'Information Sharing', body: 'We do not sell, rent, or trade your personal information. We share necessary information with delivery partners and payment processors solely to fulfil your orders. We may disclose information where required by law.' },
    { heading: 'Cookies', body: 'We use cookies to improve your browsing experience, remember your preferences, and analyse website traffic. You can control cookie settings through your browser. Disabling cookies may affect some site functionality.' },
    { heading: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at privacy@hkfabric.pk. We will respond within 30 days.' },
    { heading: 'Changes to This Policy', body: 'We may update this Privacy Policy from time to time. Material changes will be notified via email or a prominent notice on our website. Continued use of the site after changes constitutes acceptance of the updated policy.' },
  ],
}

export default function PrivacyPolicy() {
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
            <a href="mailto:privacy@hkfabric.pk" className="text-[#111111] font-medium hover:text-[#D4AF37] transition-colors">privacy@hkfabric.pk</a>
          </p>
        </div>
      </div>
    </main>
  )
}
