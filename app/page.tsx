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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);

  const categories = ['All', 'Productivity', 'Marketing', 'Development', 'Design', 'AI', 'Analytics'];

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`);
      const data = await res.json();
      setProducts(prev => page === 1 ? data : [...prev, ...data]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const handleUpvote = async (slug: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upvote/${slug}`, { method: 'POST' });
      const data = await res.json();
      setProducts(prev => prev.map(p => p.slug === slug ? {...p, upvotes: data.upvotes} : p));
    } catch (e) {}
  };

  const filtered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Fixed Header with Submit Button */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NodeMeld
          </h2>
          <Link href="/submit" style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            ➕ Submit SaaS
          </Link>
        </div>
      </div>

      <div style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 900, marginBottom: '20px', background: 'linear-gradient(135deg, #ffffff, #667eea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Discover SaaS
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>
            {products.length}+ products • Ranked by community
          </p>

          <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by name, use case, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass"
              style={{ width: '100%', padding: '20px 120px 20px 24px', fontSize: '16px', borderRadius: '16px', color: 'white', outline: 'none' }}
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: selectedCategory === cat ? 'rgba(102,126,234,0.3)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                border: selectedCategory === cat ? '1px solid rgba(102,126,234,0.5)' : '1px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>Loading...</p>}

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filtered.map((product) => (
              <div key={product.id} className="glass" style={{ padding: '24px', borderRadius: '20px', position: 'relative' }}>
                <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                  {product.logo_url && (
                    <img src={product.logo_url} alt={product.name} style={{ width: '56px', height: '56px', marginBottom: '16px', borderRadius: '12px' }} />
                  )}
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{product.name}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: '1.6' }}>
                    {product.description?.substring(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span className="mono" style={{ color: '#667eea' }}>{product.pricing}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>👁 {product.views}</span>
                  </div>
                </Link>
                
                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(product.slug)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(102,126,234,0.2)',
                    border: '1px solid rgba(102,126,234,0.3)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  ▲ {product.upvotes || 0}
                </button>
                
                {product.category && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(118,75,162,0.3)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 600
                  }}>
                    {product.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => setPage(p => p + 1)} style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600
            }}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
