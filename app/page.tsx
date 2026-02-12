'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Productivity', 'Marketing', 'Development', 'Design', 'AI', 'Analytics'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)',
        filter: 'blur(60px)',
        animation: 'pulse 10s infinite alternate'
      }} />

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            🔗 NodeMeld
          </h1>
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '10px',
            fontWeight: 500
          }}>
            World's Largest SaaS Directory
          </p>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '40px'
          }}>
            {products.length}+ Products • Auto-Updated Daily • Part of KRYV Network
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search 1000+ SaaS products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 60px 20px 24px',
                fontSize: '16px',
                borderRadius: '16px',
                border: '2px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(102,126,234,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
            <span style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '14px'
            }}>
              {filtered.length} results
            </span>
          </div>

          {/* Category Filter */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedCategory === cat ? 'rgba(102,126,234,0.3)' : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  border: selectedCategory === cat ? '1px solid rgba(102,126,234,0.5)' : '1px solid transparent'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading/Error States */}
        {loading && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}>
            <div className="shimmer" style={{ width: '100px', height: '100px', margin: '0 auto 20px', borderRadius: '50%' }} />
            Loading products...
          </div>
        )}
        {error && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(255,0,0,0.1)',
            borderRadius: '16px',
            color: '#ff6b6b',
            border: '1px solid rgba(255,0,0,0.2)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <p style={{ fontSize: '48px', marginBottom: '20px' }}>🤷</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px', marginBottom: '10px' }}>No products found</p>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Be the first to add a SaaS in this category!</p>
                <Link href="/submit" style={{
                  display: 'inline-block',
                  marginTop: '30px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  Submit Your SaaS
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}>
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      style={{
                        display: 'block',
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textDecoration: 'none',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(102,126,234,0.3)';
                        e.currentTarget.style.borderColor = 'rgba(102,126,234,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      }}
                    >
                      {/* Logo */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        overflow: 'hidden'
                      }}>
                        {product.logo_url ? (
                          <img src={product.logo_url} alt={product.name} style={{ width: '40px', height: '40px' }} />
                        ) : (
                          <span style={{ fontSize: '28px' }}>🚀</span>
                        )}
                      </div>

                      <h3 style={{
                        fontSize: '22px',
                        marginBottom: '12px',
                        fontWeight: 700,
                        color: 'white'
                      }}>
                        {product.name}
                      </h3>

                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '16px',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.5)'
                      }}>
                        <span>👁 {product.views || 0}</span>
                        <span style={{
                          background: 'rgba(102,126,234,0.2)',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          color: 'rgba(102,126,234,1)',
                          fontWeight: 600
                        }}>
                          {product.pricing || 'Free'}
                        </span>
                      </div>

                      {product.category && (
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: 'rgba(118,75,162,0.3)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          {product.category}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Submit CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '80px',
            padding: '60px 40px',
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            color: 'white',
            marginBottom: '20px',
            fontWeight: 800
          }}>
            List Your SaaS for Free
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}>
            Join 1000+ SaaS products. Get instant exposure to thousands of users. No approval needed.
          </p>
          <Link href="/submit" style={{
            display: 'inline-block',
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '14px',
            fontSize: '18px',
            fontWeight: 700,
            boxShadow: '0 10px 40px rgba(102,126,234,0.4)',
            transition: 'all 0.3s ease'
          }}>
            ➕ Submit Your SaaS Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
