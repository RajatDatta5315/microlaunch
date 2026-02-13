'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0a0f' }}>
      {/* Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
        filter: 'blur(80px)'
      }} />

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 style={{
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontWeight: 900,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            NodeMeld
          </h1>
          <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontWeight: 500 }}>
            Discover the World's SaaS
          </p>
          <p className="mono" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            {products.length}+ products • Auto-updated • KRYV Network
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '40px auto 0', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search SaaS products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass"
              style={{
                width: '100%',
                padding: '20px 120px 20px 24px',
                fontSize: '16px',
                borderRadius: '16px',
                color: 'white',
                outline: 'none'
              }}
            />
            <button type="submit" style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Search
            </button>
          </form>

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

        {/* Loading/Error */}
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>Loading...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ff6b6b' }}>Error: {error}</p>}
        
        {!loading && !error && filtered.length === 0 && (
          <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '20px' }}>
            <p style={{ fontSize: '48px', marginBottom: '20px' }}>🤷</p>
            <p style={{ fontSize: '20px' }}>No products yet</p>
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
              Be the First!
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="glass"
                  style={{
                    display: 'block',
                    padding: '24px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(102,126,234,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Logo */}
                  {product.logo_url && (
                    <img src={product.logo_url} alt={product.name} style={{ width: '56px', height: '56px', marginBottom: '16px', borderRadius: '12px' }} />
                  )}

                  <h3 style={{ fontSize: '22px', marginBottom: '12px', fontWeight: 700 }}>
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span className="mono" style={{ color: '#667eea' }}>{product.pricing || 'Free'}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>👁 {product.views || 0}</span>
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

        {/* CTA */}
        <div className="glass" style={{ marginTop: '80px', padding: '60px 40px', textAlign: 'center', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px' }}>List Your SaaS</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>Free • Instant • No Approval</p>
          <Link href="/submit" style={{
            display: 'inline-block',
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '14px',
            fontSize: '18px',
            fontWeight: 700
          }}>
            Submit Now
          </Link>
        </div>
      </div>
    </div>
  );
}
