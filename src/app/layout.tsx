import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'World Cup 2026 · Bracket Simulator',
  description: 'Simulate the complete 2026 FIFA World Cup — 48 teams, 12 groups, full bracket to the Final. Predict, simulate, share.',
  keywords: ['world cup 2026', 'fifa', 'simulator', 'bracket', 'football', 'soccer'],
  authors: [{ name: 'WC2026 Simulator' }],
  openGraph: {
    title: 'World Cup 2026 Bracket Simulator',
    description: 'Predict every match. Crown your champion.',
    type: 'website',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020815',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
