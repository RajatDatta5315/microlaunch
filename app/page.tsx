'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nodemeld-api.kryv.workers.dev';

// ── KRYV Empire products hardcoded ──────────────────────────────────
const KRYV_PRODUCTS = [
  { id: 'k1', name: 'VELQA', slug: 'velqa-geo-engine', description: 'AI-powered Generative Engine Optimization. Automatically generates llms.txt, JSON-LD schemas, and AI-optimized robots.txt so your SaaS gets cited by GPTBot, Claude-Web, and PerplexityBot.', url: 'https://velqa.kryv.network', pricing: 'Free Beta', category: 'Marketing', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 42, is_kryv: true },
  { id: 'k2', name: 'NodeMeld', slug: 'nodemeld-discovery', description: 'Indie SaaS discovery platform that surfaces profitable tools built by solo founders. AI-curated from r/SideProject, r/indiehackers and bootstrapped communities.', url: 'https://nodemeld.kryv.network', pricing: 'Free', category: 'Marketing', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 38, is_kryv: true },
  { id: 'k3', name: 'KRYVLayer', slug: 'kryvlayer-seo', description: 'AI programmatic SEO engine. Connect your domain once, NEHIRA AI generates thousands of unique landing pages automatically. Zero maintenance required.', url: 'https://kryvlayer.kryv.network', pricing: 'Freemium', category: 'Marketing', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 55, is_kryv: true },
  { id: 'k4', name: 'RYDEN', slug: 'ryden-social-agi', description: 'Autonomous Social AGI. AI agent that independently manages your X (Twitter), Reddit, and Telegram presence — posts, replies, and grows your audience 24/7.', url: 'https://ryden.kryv.network', pricing: 'Beta', category: 'Marketing', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 67, is_kryv: true },
  { id: 'k5', name: 'DevMasiha', slug: 'devmasiha-debug', description: 'Autonomous AI debugging and code-healing platform. Powered by Dynlith engine. Detects, diagnoses, and fixes bugs automatically across your entire codebase.', url: 'https://devmasiha.kryv.network', pricing: 'Beta', category: 'Development', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 89, is_kryv: true },
  { id: 'k6', name: 'VIGILIS', slug: 'vigilis-ai-detector', description: 'AI false conversation detector. Sends trap prompts to AI systems, detects harmful or incorrect responses, and alerts you instantly across Reddit, Bluesky, and Mastodon.', url: 'https://vigilis.kryv.network', pricing: 'Free', category: 'AI', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 31, is_kryv: true },
  { id: 'k7', name: 'KRIYEx', slug: 'kriyex-marketplace', description: 'AI agent marketplace. List, sell, or rent your autonomous agents. Buyers discover, test, and deploy agents directly — the Shopify for AI agents.', url: 'https://kriyex.kryv.network', pricing: 'Commission', category: 'AI', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 44, is_kryv: true },
  { id: 'k8', name: 'INKRUX', slug: 'inkrux-articles', description: 'Dark article and newsletter platform for indie hackers, SaaS builders, and AI developers. No paywalls. No fluff. Real insights from people who are actively shipping.', url: 'https://inkrux.kryv.network', pricing: 'Free', category: 'Marketing', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 29, is_kryv: true },
  { id: 'k9', name: 'MINDEN', slug: 'minden-humanoid', description: 'Autonomous business humanoid AI. Handles business operations, scheduling, communications, and decision support without human intervention.', url: 'https://minden.kryv.network', pricing: 'Coming Soon', category: 'AI', logo_url: 'https://logo.clearbit.com/kryv.network', upvotes: 72, is_kryv: true },
  { id: 'k10', name: 'DryPaper HQ', slug: 'drypaperhq-store', description: 'KRYV e-commerce store. Premium products curated and sold directly by the KRYV empire. Fast shipping, quality products, minimal branding.', url: 'https://drypaperhq.com', pricing: 'Store', category: 'Other', logo_url: 'https://logo.clearbit.com/drypaperhq.com', upvotes: 18, is_kryv: true },
];

const CATEGORIES = ['All', 'AI', 'Marketing', 'Development', 'Productivity', 'Design', 'Analytics', 'Other'];

const tagColors: Record<string, string> = {
  AI: '#7c3aed', Marketing: '#ec4899', Development: '#06b6d4',
  Productivity: '#10b981', Design: '#f59e0b', Analytics: '#3b82f6', Other: '#6b7280',
};

function ProductCard({ p, onUpvote }: { p: any; onUpvote: (slug: string) => void }) {
  const color = tagColors[p.category] || '#6b7280';
  return (
    <div style={{ background: '#101018', border: `1px solid ${p.is_kryv ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: 18, display: 'flex', gap: 14, transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = p.is_kryv ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = p.is_kryv ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)')}>
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        <img src={p.logo_url || `https://logo.clearbit.com/${new URL(p.url).hostname}`}
          alt={p.name} width={44} height={44}
          style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a2e' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${p.name[0]}&background=7c3aed&color=fff&size=44`; }} />
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>{p.name}</a>
            {p.is_kryv && <span style={{ fontSize: 9, padding: '2px 7px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 10, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.05em' }}>KRYV</span>}
            <span style={{ fontSize: 9, padding: '2px 7px', background: `${color}18`, borderRadius: 10, color, fontWeight: 600 }}>{p.category}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button onClick={() => onUpvote(p.slug)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#aaa', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              ▲ {p.upvotes || 0}
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#444', background: '#1a1a2e', padding: '2px 8px', borderRadius: 6 }}>{p.pricing}</span>
          <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Visit →</a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`${API}/api/products`).then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpvote = async (slug: string) => {
    const isKryv = KRYV_PRODUCTS.find(p => p.slug === slug);
    if (isKryv) { setUpvotes(prev => ({ ...prev, [slug]: (prev[slug] || 0) + 1 })); return; }
    try {
      const res = await fetch(`${API}/api/upvote/${slug}`, { method: 'POST' });
      const data = await res.json();
      setUpvotes(prev => ({ ...prev, [slug]: data.upvotes }));
    } catch {}
  };

  const allProducts = [
    ...KRYV_PRODUCTS,
    ...apiProducts.filter(p => !KRYV_PRODUCTS.find(k => k.slug === p.slug)),
  ];

  const filtered = allProducts.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>N</div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>NodeMeld</span>
            <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 4 }}>Indie SaaS</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, maxWidth: 460 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..."
              style={{ flex: 1, background: '#101018', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 14px', color: '#e0e0e0', fontSize: 13, outline: 'none' }} />
          </div>
          <Link href="/submit" style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
            + Submit Tool
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', margin: '0 0 10px' }}>
            Discover Indie <span style={{ background: 'linear-gradient(135deg, #667eea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SaaS Tools</span>
          </h1>
          <p style={{ fontSize: 15, color: '#555', maxWidth: 480, margin: '0 auto' }}>
            Built by solo founders. Not VC-backed. Actually profitable.
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${category === cat ? '#667eea' : 'rgba(255,255,255,0.08)'}`, background: category === cat ? 'rgba(102,126,234,0.15)' : 'transparent', fontSize: 12, color: category === cat ? '#a5b4fc' : '#555', cursor: 'pointer', fontWeight: 600 }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {[['🔥', `${filtered.length} tools`, 'indexed'], ['⚡', `${KRYV_PRODUCTS.length}`, 'KRYV projects'], ['🚀', 'Auto', 'updated daily']].map(([icon, val, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#101018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
              <span>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{val}</span>
              <span style={{ fontSize: 11, color: '#555' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Products */}
        {loading && apiProducts.length === 0 ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 90, background: '#101018', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {filtered.map(p => (
              <ProductCard key={p.id || p.slug} p={{ ...p, upvotes: upvotes[p.slug] ?? p.upvotes }} onUpvote={handleUpvote} />
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#444', fontSize: 13 }}>
                No tools found. <Link href="/submit" style={{ color: '#667eea', textDecoration: 'none' }}>Submit yours →</Link>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap'); @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }`}</style>
    </div>
  );
}
