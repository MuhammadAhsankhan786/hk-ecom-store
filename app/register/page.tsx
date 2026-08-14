'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Field({ label, type = 'text', placeholder, required }: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors"
      />
    </div>
  )
}

export default function Register() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push('/account')
  }

  return (
    <main className="bg-[#F8F7F3] min-h-screen flex">
      {/* Left: decorative */}
      <div className="hidden lg:block relative w-[45%] bg-[#111111] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1644955052489-10bda5c94b19?w=900&h=1200&fit=crop&auto=format"
          alt="Premium bedroom"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-14">
          <Link href="/" className="font-serif text-3xl text-white mb-2">HK Fabric</Link>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] mb-6">Home Textiles</p>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Premium bedding and home textiles crafted for comfort and elegance. Join thousands of happy customers across Pakistan.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden font-serif text-2xl text-[#111111] block mb-8">
            HK Fabric
            <span className="block text-[9px] tracking-[0.25em] uppercase text-[#D4AF37] mt-0.5">Home Textiles</span>
          </Link>

          <h1 className="font-serif text-2xl font-500 text-[#111111] mb-1">Create account</h1>
          <p className="text-sm text-[#6B6B6B] mb-7">Join HK Fabric for exclusive offers and order tracking</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" placeholder="Ayesha" required />
              <Field label="Last Name" placeholder="Khan" required />
            </div>
            <Field label="Email Address" type="email" placeholder="you@example.com" required />
            <Field label="Phone Number" placeholder="+92 300 0000000" required />
            <Field label="Password" type="password" placeholder="Min. 8 characters" required />
            <Field label="Confirm Password" type="password" placeholder="Repeat password" required />
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="accent-[#D4AF37] mt-0.5" />
              <label htmlFor="terms" className="text-xs text-[#6B6B6B]">
                I agree to the{' '}
                <Link href="/terms" className="text-[#111111] underline">Terms & Conditions</Link> and{' '}
                <Link href="/privacy-policy" className="text-[#111111] underline">Privacy Policy</Link>
              </label>
            </div>
            <button type="submit" disabled={loading} className="btn-dark w-full py-3.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>Creating…</> : 'Create Account'}
            </button>
          </form>
          <p className="text-sm text-[#6B6B6B] text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#111111] font-semibold hover:text-[#D4AF37] transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
