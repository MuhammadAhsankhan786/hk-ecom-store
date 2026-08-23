'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Orders & Delivery',
    items: [
      ['How long does delivery take?', 'We deliver within 3–5 business days across major cities in Pakistan. Remote areas may take up to 7 business days. You will receive a tracking number via SMS once your order is dispatched.'],
      ['Is delivery free?', 'Yes! We offer free delivery on all orders across Pakistan. No minimum order required.'],
      ['Can I track my order?', 'Yes. Once your order is shipped, you will receive an SMS with your tracking details. You can also log into your account to view real-time order status.'],
      ['Can I change or cancel my order?', 'Orders can be changed or cancelled within 2 hours of placement. Please contact us immediately via email at hello@hkfabric.pk. Once an order is packed, it cannot be modified.'],
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      ['What materials do you use?', 'We use a range of premium materials including 100% Pure Cotton, Cotton Satin, Jacquard Weave, Microfiber, and Cashmere-Wool blends. Material details are listed on each product page.'],
      ['Are the colours accurate to the photos?', 'We work hard to show accurate colours in our photography. However, slight variations may occur due to screen calibration differences. If you are unsatisfied, our return policy covers you.'],
      ['What sizes are available?', 'We offer Single, Double, King, and Super King sizes for most products. Size availability is noted on each product page.'],
      ['Do products shrink after washing?', 'Our products are pre-shrunk. Follow the care instructions on the label to maintain size and quality. We recommend washing at 30°C with a gentle cycle.'],
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      ['What is your return policy?', 'We accept returns within 15 days of delivery. Products must be unused, unwashed, and in original packaging. Please email hello@hkfabric.pk to initiate a return.'],
      ['How long does a refund take?', 'Once we receive and inspect your return, refunds are processed within 3–5 business days back to your Easypaisa account or original payment method.'],
      ['What if my product is damaged or defective?', 'If you receive a damaged or defective item, please contact us within 48 hours with photos. We will replace it at no cost to you.'],
    ],
  },
  {
    category: 'Payments',
    items: [
      ['What payment methods do you accept?', 'We accept Easypaisa Online Payment, Visa, and Mastercard. All payments are processed securely. We do not accept COD.'],
      ['Is online payment safe?', 'Yes. All transactions are encrypted using SSL technology. We do not store your card details.'],
      ['Do you offer instalment payments?', 'Easypaisa instalment plans (Sasta Khareedo) are available for eligible orders. Look for the instalment option at checkout.'],
    ],
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <main className="bg-white min-h-screen">
      <div className="bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2">Support</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-500 text-[#111111]">Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        {faqs.map(section => (
          <div key={section.category} className="mb-10">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-4">{section.category}</h2>
            <div className="space-y-1">
              {section.items.map(([q, a]) => {
                const key = `${section.category}:${q}`
                const isOpen = open === key
                return (
                  <div key={q} className="border border-[#E8E5DE]">
                    <button
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8F7F3] transition-colors"
                    >
                      <span className="text-sm font-medium text-[#111111] pr-4">{q}</span>
                      <svg
                        width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                        className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-[#E8E5DE]">
                        <p className="text-sm text-[#6B6B6B] leading-relaxed pt-4">{a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Still need help? */}
        <div className="bg-[#F8F7F3] p-6 lg:p-8 text-center mt-12">
          <h3 className="font-serif text-xl font-500 text-[#111111] mb-2">Still have questions?</h3>
          <p className="text-sm text-[#6B6B6B] mb-5">Our team is happy to help Monday to Saturday, 10am–7pm PKT.</p>
          <Link href="/contact" className="btn-dark inline-block px-8 py-3 text-[10px] uppercase tracking-widest">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
