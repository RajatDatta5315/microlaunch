import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.slug}`).then(r => r.json());
    return {
      title: `${product.name} - LaunchVault`,
      description: product.description || `Discover ${product.name} on LaunchVault`
    };
  } catch {
    return { title: 'Product - LaunchVault' };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product;
  try {
    product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.slug}`, { cache: 'no-store' }).then(r => r.json());
  } catch {
    return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Product not found</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '20px', 
        padding: '50px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '16px' }}>← Back to Directory</Link>
        
        <h1 style={{ fontSize: '48px', color: 'white', marginTop: '30px', marginBottom: '20px' }}>{product.name}</h1>
        
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>
          👁 {product.views} views • 💰 {product.pricing || 'Free'} • 🏷 {product.category || 'Uncategorized'}
        </div>

        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.8', marginBottom: '40px' }}>
          {product.description || 'No description available'}
        </p>
        
        <a 
          href={product.url} 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '12px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '2px solid rgba(255,255,255,0.4)'
          }}
        >
          Visit Website →
        </a>

        <div style={{ marginTop: '50px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Found this useful? Explore more tools at <Link href="/" style={{ color: 'white' }}>LaunchVault</Link> • Part of <a href="https://kryv.network" style={{ color: 'white' }}>KRYV Network</a>
          </p>
        </div>
      </div>
    </div>
  );
}
