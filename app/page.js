'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json())
      .then(setProducts);
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
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
        <h1 style={{ 
          fontSize: '48px', 
          color: 'white', 
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🚀 MicroLaunch
        </h1>
        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', marginBottom: '30px' }}>
          Discover {products.length}+ micro-SaaS products and tools
        </p>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '15px 20px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(5px)',
            color: 'white',
            marginBottom: '30px',
            outline: 'none'
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map(product => (
            <Link 
              href={`/product/${product.slug}`} 
              key={product.id}
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{product.name}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', lineHeight: '1.5' }}>
                {product.description?.substring(0, 100)}...
              </p>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                👁 {product.views} views • {product.category}
              </div>
            </Link>
          ))}
        </div>

        <Link 
          href="/submit"
          style={{
            display: 'inline-block',
            marginTop: '40px',
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid rgba(255,255,255,0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          ➕ Submit Your SaaS
        </Link>
      </div>
    </div>
  );
}
