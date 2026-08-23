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

export default function Login() {
  const [mode, setMode] = useState<'login' | 'forgot' | 'otp'>('login')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    if (mode === 'forgot') { setMode('otp'); return }
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

          {mode === 'login' && (
            <>
              <h1 className="font-serif text-2xl font-500 text-[#111111] mb-1">Welcome back</h1>
              <p className="text-sm text-[#6B6B6B] mb-7">Sign in to your HK Fabric account</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Email Address" type="email" placeholder="you@example.com" required />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-[#111111]">Password <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-[#D4AF37] hover:underline">Forgot?</button>
                  </div>
                  <input type="password" placeholder="••••••••" className="w-full border border-[#E8E5DE] px-3.5 py-2.5 text-sm placeholder:text-[#B0ADA6] focus:outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <button type="submit" disabled={loading} className="btn-dark w-full py-3.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>Signing in…</> : 'Sign In'}
                </button>
              </form>
              <p className="text-sm text-[#6B6B6B] text-center mt-6">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#111111] font-semibold hover:text-[#D4AF37] transition-colors">Create one</Link>
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <button onClick={() => setMode('login')} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#6B6B6B] hover:text-[#111111] transition-colors mb-7">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" /></svg>
                Back to Login
              </button>
              <h1 className="font-serif text-2xl font-500 text-[#111111] mb-1">Reset password</h1>
              <p className="text-sm text-[#6B6B6B] mb-7">Enter your email and we'll send you a verification code</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Email Address" type="email" placeholder="you@example.com" required />
                <button type="submit" disabled={loading} className="btn-dark w-full py-3.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>Sending…</> : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {mode === 'otp' && (
            <>
              <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                <svg width="22" height="22" fill="none" stroke="#D4AF37" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl font-500 text-[#111111] mb-1">Check your email</h1>
              <p className="text-sm text-[#6B6B6B] mb-7">We sent a 6-digit code to <span className="font-medium text-[#111111]">you@example.com</span></p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-[#111111] mb-1.5">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full border border-[#E8E5DE] px-3.5 py-3 text-xl text-center tracking-[0.5em] font-semibold text-[#111111] placeholder:tracking-[0.3em] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
                <Field label="New Password" type="password" placeholder="Min. 8 characters" required />
                <button type="submit" disabled={loading} className="btn-dark w-full py-3.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" /></svg>Verifying…</> : 'Reset Password'}
                </button>
                <p className="text-center text-xs text-[#6B6B6B]">
                  Didn't receive it?{' '}
                  <button type="button" className="text-[#D4AF37] font-medium hover:underline">Resend code</button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
