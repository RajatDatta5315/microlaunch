import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'NodeMeld - World\'s Largest SaaS Directory',
  description: 'Discover 1000+ micro-SaaS products. Submit yours instantly. Part of KRYV Network.',
  keywords: 'saas, micro-saas, tools, software, directory, alternatives',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
        <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="afterInteractive" />
        <Script id="eruda-init" strategy="afterInteractive">{`eruda.init();`}</Script>
      </head>
      <body style={{ 
        margin: 0, 
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui'
      }}>
        {children}
      </body>
    </html>
  )
}
