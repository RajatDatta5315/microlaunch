import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'NodeMeld - Discover Micro-SaaS Products',
  description: 'The ultimate database of micro-SaaS products. Find alternatives, discover new tools.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="beforeInteractive" />
        <Script id="eruda-init" strategy="beforeInteractive">
          {`eruda.init();`}
        </Script>
      </head>
      <body style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', fontFamily: 'system-ui' }}>
        {children}
      </body>
    </html>
  )
}
