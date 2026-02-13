'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.slug}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  const handleUpvote = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upvote/${params.slug}`, { method: 'POST' });
      const data = await res.json();
      setProduct({...product, upvotes: data.upvotes});
    } catch (e) {}
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ marginTop: '30px', padding: '50px', borderRadius: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            {product.logo_url && (
              <img src={product.logo_url} alt={product.name} style={{ width: '80px', height: '80px', marginRight: '24px', borderRadius: '16px' }} />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '10px' }}>{product.name}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                <span className="mono">💰 {product.pricing}</span>
                <span>👁 {product.views} views</span>
                <span>🏷 {product.category}</span>
              </div>
            </div>
            <button onClick={handleUpvote} style={{
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '16px'
            }}>
              ▲ Upvote ({product.upvotes || 0})
            </button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '30px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#667eea' }}>About</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
              {product.description}
            </p>
          </div>

          <a href={product.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block',
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '14px',
            fontSize: '18px',
            fontWeight: 700,
            boxShadow: '0 10px 40px rgba(102,126,234,0.4)'
          }}>
            Visit Website →
          </a>

          <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            Part of <Link href="/" style={{ color: 'white' }}>NodeMeld</Link> • KRYV Network
          </div>
        </motion.div>
      </div>
    </div>
  );
}
