import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'NodeMeld - World\'s Largest SaaS Directory',
  description: 'Discover 1000+ micro-SaaS products. Auto-updated daily.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
        <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="afterInteractive" />
        <Script id="eruda-init" strategy="afterInteractive">{`eruda.init();`}</Script>
      </head>
      <body style={{ 
        margin: 0, 
        background: '#0a0a0f',
        minHeight: '100vh',
        fontFamily: 'Geist, -apple-system, sans-serif',
        color: 'white'
      }}>
        {children}
      </body>
    </html>
  )
}
