import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LaunchVault - Discover Micro-SaaS Products',
  description: 'The ultimate database of micro-SaaS products. Find alternatives, discover new tools.',
  keywords: 'saas, micro-saas, tools, software, alternatives',
  openGraph: {
    title: 'LaunchVault - Discover Micro-SaaS Products',
    description: 'The ultimate database of micro-SaaS products',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
