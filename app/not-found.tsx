import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="bg-[#F8F7F3] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white p-10 lg:p-14 border border-[#E8E5DE] shadow-sm">
        <p className="font-serif text-6xl lg:text-7xl font-500 text-[#D4AF37] mb-2">404</p>
        <h1 className="font-serif text-2xl font-500 text-[#111111] mb-2">Page Not Found</h1>
        <p className="text-sm text-[#6B6B6B] mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-dark flex-1 py-3 text-[10px] uppercase tracking-widest text-center">
            Back to Home
          </Link>
          <Link href="/shop" className="btn-ghost flex-1 py-3 text-[10px] uppercase tracking-widest text-center">
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  )
}
