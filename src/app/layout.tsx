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
  title: 'World Cup 2026 Simulator',
  description: 'Simulate the complete 2026 World Cup — 48 teams, 12 groups, Round of 32 through to the Final. Unofficial fan simulator.',
  keywords: ['world cup 2026', 'simulator', 'football', 'soccer', 'bracket', 'fan app'],
  authors: [{ name: 'CupSim 26' }],
  openGraph: {
    title: 'World Cup 2026 Simulator',
    description: 'Simulate every match. Crown your champion.',
    type: 'website',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#05070D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`pitch-lines ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
