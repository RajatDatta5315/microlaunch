export async function generateMetadata({ params }) {
  const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.slug}`).then(r => r.json());
  return {
    title: `${product.name} - MicroLaunch`,
    description: product.description
  };
}

export default async function ProductPage({ params }) {
  const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.slug}`, { cache: 'no-store' }).then(r => r.json());

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '20px', 
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <a href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>← Back</a>
        <h1 style={{ fontSize: '42px', color: 'white', marginTop: '20px' }}>{product.name}</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>{product.description}</p>
        
        <div style={{ marginTop: '30px' }}>
          <a 
            href={product.url} 
            target="_blank"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '10px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Visit Website →
          </a>
        </div>

        <div style={{ marginTop: '30px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          👁 {product.views} views • 💰 {product.pricing} • 🏷 {product.category}
        </div>
      </div>
    </div>
  );
}
