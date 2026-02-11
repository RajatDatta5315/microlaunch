export const metadata = {
  title: 'MicroLaunch - Discover New Micro-SaaS Products',
  description: 'The ultimate database of micro-SaaS products, tools, and startups. Find your next SaaS idea or discover alternatives.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
