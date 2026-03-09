'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nodemeld-api.kryv.workers.dev';

const ALL_28_PROJECTS = [
  // ── KRYV Core ────────────────────────────────────────────
  { id:'k1', name:'KRYV Network', slug:'kryv-network-social', description:'The KRYV social media network and empire hub. The central platform connecting all 28 KRYV products and projects under one brand.', url:'https://kryv.network', pricing:'Free', category:'Social', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:88, is_kryv:true },
  { id:'k2', name:'DryPaper HQ', slug:'drypaperhq-store', description:'KRYV e-commerce store. Premium products curated and sold directly. Fast shipping, quality products, minimal branding.', url:'https://drypaperhq.com', pricing:'Store', category:'Other', logo_url:'https://logo.clearbit.com/drypaperhq.com', upvotes:22, is_kryv:true },
  { id:'k3', name:'NEHIRA', slug:'nehira-ai-companion', description:'The AI brain powering the KRYV empire. Nehira is an autonomous AI companion — a humanoid AI brain that connects to all KRYV systems and operates as their cognitive core.', url:'https://nehira.space', pricing:'Internal', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:120, is_kryv:true },
  // ── AI Tools ────────────────────────────────────────────
  { id:'k4', name:'VELQA', slug:'velqa-geo-engine', description:'Generative Engine Optimization tool. Automatically generates llms.txt, JSON-LD schemas, AI-optimized robots.txt — makes your SaaS visible to GPTBot, Claude-Web, and PerplexityBot. Now with GitHub OAuth auto-monitoring.', url:'https://velqa.kryv.network', pricing:'Free Beta', category:'Marketing', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:65, is_kryv:true },
  { id:'k5', name:'VIGILIS', slug:'vigilis-ai-detector', description:'AI false conversation detector. Sends trap prompts to AI systems, detects harmful or incorrect responses, and alerts you across Reddit, Bluesky, and Mastodon in real-time.', url:'https://vigilis.kryv.network', pricing:'Free', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:44, is_kryv:true },
  { id:'k6', name:'VOKRYL', slug:'vokryl-nehira-hub', description:'Nehira architectural hub. The place to see Nehira, take Nehira keys, and manage drone agents. Nehira generates drones or assigns them to her team — drones work autonomously under her.', url:'https://vokryl.kryv.network', pricing:'Internal', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:55, is_kryv:true },
  { id:'k7', name:'MINDEN', slug:'minden-business-humanoid', description:'Autonomous business humanoid AI. Handles business operations, scheduling, communications, and decision support without human intervention.', url:'https://minden.kryv.network', pricing:'Coming Soon', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:79, is_kryv:true },
  // ── Marketing & SEO ────────────────────────────────────
  { id:'k8', name:'RYDEN', slug:'ryden-social-agi', description:'Autonomous Social AGI. AI agent that independently manages your X (Twitter), Reddit, and Telegram presence — posts, replies, and grows your audience 24/7 without manual effort.', url:'https://ryden.kryv.network', pricing:'Beta', category:'Marketing', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:91, is_kryv:true },
  { id:'k9', name:'KRYVLayer', slug:'kryvlayer-programmatic-seo', description:'AI-powered programmatic SEO and infinite landing page builder. Connect your domain once, NEHIRA generates thousands of unique SEO-optimized pages automatically. Zero maintenance.', url:'https://kryvlayer.kryv.network', pricing:'Freemium', category:'Marketing', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:72, is_kryv:true },
  { id:'k10', name:'NodeMeld', slug:'nodemeld-saas-discovery', description:'Indie SaaS discovery platform. Surfaces profitable tools built by solo founders and small bootstrapped teams — curated from r/SideProject, r/indiehackers, and bootstrapped communities.', url:'https://nodemeld.kryv.network', pricing:'Free', category:'Marketing', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:48, is_kryv:true },
  { id:'k11', name:'INKRUX', slug:'inkrux-articles', description:'Dark article and newsletter platform for indie hackers, SaaS builders, and AI developers. Instrument Serif editorial design. No paywalls. Real insights from people actively shipping.', url:'https://inkrux.kryv.network', pricing:'Free', category:'Marketing', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:35, is_kryv:true },
  // ── Development ────────────────────────────────────────
  { id:'k12', name:'DevMasiha', slug:'devmasiha-autonomous-debug', description:'Autonomous AI debugging and code-healing platform. Powered by the Dynlith engine. Detects, diagnoses, and autonomously fixes bugs across your entire codebase — no manual intervention.', url:'https://devmasiha.kryv.network', pricing:'Beta', category:'Development', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:102, is_kryv:true },
  { id:'k13', name:'RELYX', slug:'relyx-git-transfer', description:'Autonomous Git transfer AGI. Automatically manages repository migrations, branch strategies, merge operations, and git workflows across multiple repositories without manual git commands.', url:'https://relyx.kryv.network', pricing:'Beta', category:'Development', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:38, is_kryv:true },
  { id:'k14', name:'KRYVGEN', slug:'kryvgen-auto-app-builder', description:'Autonomous app builder. gen.kryv.network — describe your idea and KRYVGEN builds the full application automatically, from architecture to deployment. AI-first app generation.', url:'https://gen.kryv.network', pricing:'Coming Soon', category:'Development', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:67, is_kryv:true },
  { id:'k15', name:'ERA', slug:'era-gamified-debug', description:'Gamified debug learning platform. Developers level up by solving real debugging challenges. XP, leaderboards, and AI-assisted hints make learning to debug addictive and effective.', url:'https://era.kryv.network', pricing:'Free', category:'Development', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:29, is_kryv:true },
  // ── Agent Economy ──────────────────────────────────────
  { id:'k16', name:'KRIYEx', slug:'kriyex-agent-marketplace', description:'AI agent marketplace. List, sell, or rent your autonomous agents. Buyers discover, test, and deploy agents directly from the marketplace — the Shopify for AI agents.', url:'https://kriyex.kryv.network', pricing:'Commission', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:59, is_kryv:true },
  { id:'k17', name:'KRYVx', slug:'kryvx-agent-stock', description:'Agents stock market. Buy, sell, and trade shares of autonomous AI agents. Agents have valuations that fluctuate based on performance, uptime, and earnings. AI meets DeFi.', url:'https://kryvx.kryv.network', pricing:'Commission', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:81, is_kryv:true },
  { id:'k18', name:'ArenaIX', slug:'arenaix-agent-battle', description:'AI agent battleground. Agents compete head-to-head in structured challenges — coding, reasoning, persuasion. Watch agents fight, bet on outcomes, and deploy the winners.', url:'https://arenaix.kryv.network', pricing:'Free', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:74, is_kryv:true },
  { id:'k19', name:'Genesis', slug:'genesis-agentic-orchestration', description:'Agentic orchestration platform. Coordinate and chain multiple autonomous agents into complex workflows. Genesis is the brain behind multi-agent pipelines in the KRYV ecosystem.', url:'https://genesis.kryv.network', pricing:'Coming Soon', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:60, is_kryv:true },
  { id:'k20', name:'KRYVLABS', slug:'kryvlabs-agent-lab', description:'The laboratory for creating autonomous agents. KRYVLABS provides tools, templates, and testing environments to build, train, and deploy production-ready AI agents on the KRYV network.', url:'https://labs.kryv.network', pricing:'Beta', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:43, is_kryv:true },
  { id:'k21', name:'KRYV MCP', slug:'kryv-mcp-servers', description:'MCP (Model Context Protocol) server marketplace. Deploy and connect standardized AI tool servers to any LLM. The infrastructure layer for connecting AI models to real-world actions.', url:'https://mcp.kryv.network', pricing:'Freemium', category:'Development', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:51, is_kryv:true },
  // ── Finance & Intelligence ────────────────────────────
  { id:'k22', name:'KMND (KryvMind)', slug:'kmnd-currency-holder', description:'Autonomous currency holder. KMND manages, trades, and grows digital asset portfolios without human intervention. AI-driven portfolio management and autonomous trading agent.', url:'https://kmnd.kryv.network', pricing:'Coming Soon', category:'Finance', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:95, is_kryv:true },
  { id:'k23', name:'MindPal', slug:'mindpal-ai-notes', description:'AI-powered note-taking application. MindPal connects ideas, summarizes content, and builds a second brain that gets smarter as you use it. Autonomous knowledge management.', url:'https://mindpal.kryv.network', pricing:'Freemium', category:'Productivity', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:34, is_kryv:true },
  // ── Deep Tech ─────────────────────────────────────────
  { id:'k24', name:'SolAequi', slug:'solaequi-quantum', description:'Quantum enhancement platform. SolAequi explores quantum computing applications for AI optimization, cryptography, and computation. The KRYV gateway to quantum-classical hybrid systems.', url:'https://solaequi.kryv.network', pricing:'Research', category:'Deep Tech', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:45, is_kryv:true },
  { id:'k25', name:'CoreNautics', slug:'corenuatics-nanotech', description:'Nano technology research and application platform. CoreNautics works on nanoscale computing, materials, and biointegration — the physical layer of the KRYV technology stack.', url:'https://corenuatics.kryv.network', pricing:'Research', category:'Deep Tech', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:32, is_kryv:true },
  { id:'k26', name:'O (BioTech)', slug:'o-biotech-kryv', description:'Biotech research platform. o.kryv.network explores the intersection of biology and AI — bioinformatics, synthetic biology, and AI-assisted biological discovery.', url:'https://o.kryv.network', pricing:'Research', category:'Deep Tech', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:28, is_kryv:true },
  { id:'k27', name:'NEURAL', slug:'neural-synthetic-pipeline', description:'Synthetic neural pipeline and SLM (Small Language Model) platform. NEURAL builds and deploys lightweight language models optimized for edge devices and specialized KRYV use cases.', url:'https://neural.kryv.network', pricing:'Beta', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:57, is_kryv:true },
  { id:'k28', name:'CineVX', slug:'cinevx-video-generator', description:'High-quality video generation platform. CineVX goes beyond image generation — full cinematic video generation with temporal coherence, custom styles, and AI-directed scenes.', url:'https://cinevx.kryv.network', pricing:'Coming Soon', category:'AI', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:110, is_kryv:true },
  { id:'k29', name:'Decoysentinel', slug:'decoysentinel-cybersecurity', description:'Autonomous cybersecurity platform. decoysentinel.kryv.network deploys honeypots, monitors intrusion attempts, and autonomously responds to threats using AI-driven countermeasures.', url:'https://decoysentinel.kryv.network', pricing:'Beta', category:'Security', logo_url:'https://logo.clearbit.com/kryv.network', upvotes:48, is_kryv:true },
];

const CATEGORIES = ['All', 'AI', 'Marketing', 'Development', 'Deep Tech', 'Security', 'Finance', 'Productivity', 'Social', 'Other'];

const TAG_COLORS: Record<string, string> = {
  AI:'#7c3aed', Marketing:'#ec4899', Development:'#06b6d4', 'Deep Tech':'#10b981',
  Security:'#ef4444', Finance:'#f59e0b', Productivity:'#3b82f6', Social:'#8b5cf6', Other:'#6b7280',
};

function ProductCard({ p, onUpvote, editToken = '', editSlug = '', editForm = {}, setEditStatus = () => {}, setShowEdit = () => {} }: { p: any; onUpvote: (slug: string) => void; editToken?: string; editSlug?: string; editForm?: any; setEditStatus?: (s: string) => void; setShowEdit?: (b: boolean) => void }) {
  const color = TAG_COLORS[p.category] || '#6b7280';
  const handleClaim = (slug: string) => {
    // Redirect to KRYV GitHub OAuth — callback will return token to this page
    const returnUrl = window.location.origin + '?claim_slug=' + encodeURIComponent(slug);
    const state = encodeURIComponent('redirect:' + returnUrl);
    const KRYV_CLIENT_ID = 'Ov23li2oOtJSQKCUwIRr';
    const PORTAL = 'https://velqa.kryv.network/portal';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${KRYV_CLIENT_ID}&scope=read:user&redirect_uri=${encodeURIComponent(PORTAL)}&state=${state}`;
  };

  const handleEdit = async () => {
    if (!editToken || !editSlug) return;
    setEditStatus('Saving...');
    try {
      const res = await fetch(`${API}/api/edit/${editSlug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: editToken, ...editForm }) });
      const data = await res.json();
      if (data.success) { setEditStatus('✅ Saved!'); setTimeout(() => { setShowEdit(false); setEditStatus(''); }, 1500); }
      else setEditStatus(`❌ ${data.error}`);
    } catch { setEditStatus('Network error'); }
  };

  return (
    <div style={{ background: '#101018', border: `1px solid ${p.is_kryv ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: 18, display: 'flex', gap: 14, transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = p.is_kryv ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = p.is_kryv ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ flexShrink: 0 }}>
        <img src={p.logo_url} alt={p.name} width={44} height={44}
          style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a2e' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name[0])}&background=7c3aed&color=fff&size=44`; }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>{p.name}</a>
            {p.is_kryv && <span style={{ fontSize: 9, padding: '2px 7px', background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 10, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.05em' }}>KRYV</span>}
            <span style={{ fontSize: 9, padding: '2px 8px', background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 10, color, fontWeight: 600 }}>{p.category}</span>
          </div>
          <button onClick={() => onUpvote(p.slug)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#666', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            ▲ {p.upvotes || 0}
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#555', lineHeight: 1.65, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#444', background: '#1a1a2e', padding: '2px 8px', borderRadius: 6 }}>{p.pricing}</span>
          <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Visit →</a>
          {!p.is_kryv && <button onClick={() => handleClaim(p.slug)} style={{ fontSize: 10, color: '#444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Claim</button>}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [editSlug, setEditSlug] = useState('');
  const [editToken, setEditToken] = useState('');
  const [editForm, setEditForm] = useState({ name: '', description: '', logo_url: '', pricing: '', category: '' });
  const [editStatus, setEditStatus] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [githubUser, setGithubUser] = useState('');

  // Handle KRYV OAuth callback — token is passed via URL params after GitHub auth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('github_token');
    const user = params.get('github_user');
    const claimSlug = params.get('claim_slug');
    if (token) {
      setEditToken(token);
      setGithubUser(user || '');
      if (claimSlug) {
        // Auto-claim the listing
        fetch(`${API}/api/claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: claimSlug, github_token: token })
        }).then(r => r.json()).then(data => {
          if (data.success) {
            setEditSlug(claimSlug);
            setShowEdit(true);
          }
        });
      }
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    fetch(`${API}/api/products`).then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiProducts(data); })
      .catch(() => {});
  }, []);

  const handleUpvote = async (slug: string) => {
    const isKryv = ALL_28_PROJECTS.find(p => p.slug === slug);
    if (isKryv) { setUpvotes(prev => ({ ...prev, [slug]: (prev[slug] || 0) + 1 })); return; }
    try {
      const res = await fetch(`${API}/api/upvote/${slug}`, { method: 'POST' });
      const data = await res.json();
      setUpvotes(prev => ({ ...prev, [slug]: data.upvotes }));
    } catch {}
  };

  const allProducts = [
    ...ALL_28_PROJECTS,
    ...apiProducts.filter(p => !ALL_28_PROJECTS.find(k => k.slug === p.slug || k.name === p.name)),
  ];

  const filtered = allProducts.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleClaim = (slug: string) => {
    // Redirect to KRYV GitHub OAuth — callback will return token to this page
    const returnUrl = window.location.origin + '?claim_slug=' + encodeURIComponent(slug);
    const state = encodeURIComponent('redirect:' + returnUrl);
    const KRYV_CLIENT_ID = 'Ov23li2oOtJSQKCUwIRr';
    const PORTAL = 'https://velqa.kryv.network/portal';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${KRYV_CLIENT_ID}&scope=read:user&redirect_uri=${encodeURIComponent(PORTAL)}&state=${state}`;
  };

  const handleEdit = async () => {
    if (!editToken || !editSlug) return;
    setEditStatus('Saving...');
    try {
      const res = await fetch(`${API}/api/edit/${editSlug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: editToken, ...editForm }) });
      const data = await res.json();
      if (data.success) { setEditStatus('✅ Saved!'); setTimeout(() => { setShowEdit(false); setEditStatus(''); }, 1500); }
      else setEditStatus(`❌ ${data.error}`);
    } catch { setEditStatus('Network error'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap" />

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>N</div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>NodeMeld</span>
            <span style={{ fontSize: 10, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 4 }}>KRYV Empire</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, maxWidth: 380 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all 28+ projects..."
              style={{ flex: 1, background: '#101018', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 14px', color: '#e0e0e0', fontSize: 12, outline: 'none' }} />
          </div>
          <button onClick={() => setShowSubmit(!showSubmit)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Submit Tool
          </button>
          <Link href="/earn" style={{ padding: '9px 16px', background: 'rgba(34,217,138,0.1)', border: '1px solid rgba(34,217,138,0.22)', borderRadius: 10, color: '#22d98a', fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            💰 Earn
          </Link>
          <Link href="/campaigns" style={{ padding: '9px 16px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.22)', borderRadius: 10, color: '#a855f7', fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            📣 Run Ads
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 46px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', margin: '0 0 10px' }}>
            The KRYV <span style={{ background: 'linear-gradient(135deg, #667eea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Empire Directory</span>
          </h1>
          <p style={{ fontSize: 14, color: '#444', maxWidth: 460, margin: '0 auto' }}>
            All 28+ KRYV projects. Indie SaaS, AI agents, deep tech, and the full autonomous empire.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {[['⚡', String(ALL_28_PROJECTS.length), 'KRYV projects'], ['🌐', String(filtered.length), 'showing'], ['🤖', '14', 'autonomous agents'], ['🔥', 'Live', 'auto-updated']].map(([icon, val, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#101018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
              <span>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{val}</span>
              <span style={{ fontSize: 11, color: '#444' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${category === cat ? '#667eea' : 'rgba(255,255,255,0.08)'}`, background: category === cat ? 'rgba(102,126,234,0.15)' : 'transparent', fontSize: 12, color: category === cat ? '#a5b4fc' : '#555', cursor: 'pointer', fontWeight: 600 }}>
              {cat} {category === cat && filtered.length > 0 && category !== 'All' ? `(${filtered.length})` : ''}
            </button>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map(p => (
            <ProductCard key={p.id || p.slug} p={{ ...p, upvotes: upvotes[p.slug] ?? p.upvotes }} onUpvote={handleUpvote} />
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#333', fontSize: 13 }}>No results found.</div>
          )}
        </div>

        {/* Edit modal */}
        {showEdit && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}
            onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
            <div style={{ background: '#101018', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Edit Listing</h2>
              <p style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>Editing: <span style={{ color: '#7c3aed' }}>{editSlug}</span></p>
              {[
                { label: 'Product Name', key: 'name', placeholder: 'My SaaS' },
                { label: 'Logo URL', key: 'logo_url', placeholder: 'https://logo.clearbit.com/myapp.com' },
                { label: 'Pricing', key: 'pricing', placeholder: 'Free / $9/mo' },
                { label: 'Category', key: 'category', placeholder: 'AI / Marketing / Development...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#555', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  <input value={(editForm as any)[key]} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                    style={{ width: '100%', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#e0e0e0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: '#555', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="What does your SaaS do? (min 50 chars)"
                  style={{ width: '100%', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#e0e0e0', fontSize: 13, outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
              </div>
              {editStatus && <p style={{ fontSize: 12, color: editStatus.startsWith('✅') ? '#4ade80' : editStatus.startsWith('❌') ? '#ef4444' : '#9ca3af', marginBottom: 12 }}>{editStatus}</p>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleEdit} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                <button onClick={() => setShowEdit(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#666', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      {/* Submit modal */}
        {showSubmit && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}
            onClick={e => e.target === e.currentTarget && setShowSubmit(false)}>
            <div style={{ background: '#101018', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Submit Your Tool</h2>
              <p style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>Submit your indie SaaS or tool for discovery on NodeMeld. We index small profitable founders — not VC-backed startups.</p>
              <Link href="/submit" style={{ display: 'block', padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 12, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, textAlign: 'center' }}>
                Go to Submit Page →
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');`}</style>
    </div>
  );
}
