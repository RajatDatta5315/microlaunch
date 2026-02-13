'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Home
        </Link>

        <h1 style={{ fontSize: '48px', marginTop: '20px', marginBottom: '10px', fontWeight: 900 }}>
          Search Results
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '18px' }}>
          {results.length} results for "<span style={{ color: 'white' }}>{query}</span>"
        </p>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Searching...</p>
        ) : results.length === 0 ? (
          <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '20px' }}>
            <p style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</p>
            <p style={{ fontSize: '20px' }}>No results found</p>
            <Link href="/submit" style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              Add This SaaS
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {results.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/product/${product.slug}`} className="glass" style={{
                  display: 'block',
                  padding: '24px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  {product.logo_url && (
                    <img src={product.logo_url} alt={product.name} style={{ width: '56px', height: '56px', marginBottom: '16px', borderRadius: '12px' }} />
                  )}
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{product.name}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                    {product.description?.substring(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span className="mono" style={{ color: '#667eea' }}>{product.pricing}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{product.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
