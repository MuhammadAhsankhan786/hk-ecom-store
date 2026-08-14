import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '../src/store'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'

export const metadata: Metadata = {
  title: 'HK Fabric Store | Premium Home Textiles Pakistan',
  description: 'Buy premium quality bedsheets, comforters, blankets, and cushions online in Pakistan. Free nationwide delivery on all orders.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <StoreProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
