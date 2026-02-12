'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://microlaunch-api.rajatdatta90000.workers.dev';
    console.log('Fetching from:', apiUrl);
    
    fetch(`${apiUrl}/api/products`)
      .then(r => {
        console.log('Response:', r);
        return r.json();
      })
      .then(data => {
        console.log('Products:', data);
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '20px', 
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '56px', color: 'white', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', fontWeight: 'bold' }}>
            🔗 NodeMeld
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)' }}>
            Discover {products.length}+ micro-SaaS • Part of KRYV Network
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '18px 24px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(5px)',
            color: 'white',
            marginBottom: '40px',
            outline: 'none'
          }}
        />

        {loading && <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
        
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: 'white', textAlign: 'center' }}>No products yet. Be first to submit!</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filtered.map(product => (
            <Link href={`/product/${product.slug}`} key={product.id} style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.2)',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'block'
            }}>
              <h3 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>{product.name}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px', lineHeight: '1.6' }}>
                {product.description?.substring(0, 120)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                <span>👁 {product.views}</span>
                <span>💰 {product.pricing}</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link href="/submit" style={{
            display: 'inline-block',
            padding: '18px 36px',
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid rgba(255,255,255,0.4)'
          }}>
            ➕ Submit Your SaaS
          </Link>
        </div>
      </div>
    </div>
  );
}
