'use client'

import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#F8F7F3] border-b border-[#E8E5DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2">Get in Touch</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-500 text-[#111111]">Contact Us</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">We'd love to hear from you. Our team is available Mon–Sat, 10am–7pm PKT.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div>
            <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="font-serif text-lg font-500 text-green-900 mb-1">Message Sent!</h3>
                <p className="text-xs text-green-700">Thank you for contacting HK Fabric. Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Full Name *</label>
                    <input type="text" required placeholder="Ayesha Khan" className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Email Address *</label>
                    <input type="email" required placeholder="you@example.com" className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Phone / WhatsApp</label>
                  <input type="text" placeholder="+92 300 0000000" className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Subject</label>
                  <select className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] bg-white focus:outline-none focus:border-[#D4AF37] transition-colors">
                    <option>General Inquiry</option>
                    <option>Order Status / Tracking</option>
                    <option>Returns & Refunds</option>
                    <option>Bulk / Wholesale Orders</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Message *</label>
                  <textarea required rows={5} placeholder="How can we help you?" className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-dark w-full py-3.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-500 text-[#111111] mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { label: 'Address', detail: 'HK Fabric Flagship Store, Main Boulevard, Gulberg III, Lahore, Pakistan' },
                  { label: 'Phone / WhatsApp', detail: '+92 300 1234567 / +92 42 35789000' },
                  { label: 'Email', detail: 'hello@hkfabric.pk / support@hkfabric.pk' },
                  { label: 'Operating Hours', detail: 'Monday – Saturday: 10:00 AM – 7:00 PM PKT' },
                ].map(item => (
                  <div key={item.label} className="border-b border-[#E8E5DE] pb-4">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-1">{item.label}</p>
                    <p className="text-sm text-[#111111]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F8F7F3] p-6 border border-[#E8E5DE]">
              <h3 className="font-serif text-lg font-500 text-[#111111] mb-2">Need quick help?</h3>
              <p className="text-xs text-[#6B6B6B] mb-4">Check our frequently asked questions for quick answers regarding delivery, returns, and payments.</p>
              <a href="/faq" className="text-[10px] uppercase tracking-widest font-semibold text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                View FAQs →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
