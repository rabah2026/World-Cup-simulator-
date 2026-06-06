import type { Metadata, Viewport } from 'next'
import './globals.css'

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="pitch-lines">
        {children}
      </body>
    </html>
  )
}
