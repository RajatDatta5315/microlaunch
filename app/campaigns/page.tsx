'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nodemeld-api.kryv.workers.dev';
const KRYV_CLIENT_ID = 'Ov23li2oOtJSQKCUwIRr';
// GitHub OAuth removed — using PAT prompt

interface Campaign { id: number; title: string; cpu: number; budget: number; budget_spent: number; status: string; product_slug: string; milestone: string; }
interface Product { slug: string; name: string; }

export default function CampaignsPage() {
  const [token, setToken]         = useState('');
  const [products, setProducts]   = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm]           = useState({ product_slug: '', title: '', description: '', cpu: 100, budget: 1000, milestone: 'signup', target_category: '' });
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('github_token');
    if (t) {
      setToken(t);
      window.history.replaceState({}, '', '/campaigns');
      loadMyData(t);
    }
  }, []);

const login = () => {
    const clientId = 'Ov23li2oOtJSQKCUwIRr';
    const redirect = encodeURIComponent('https://velqa.kryv.network/portal');
    const state = encodeURIComponent('redirect:' + window.location.origin + '/campaigns');
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=read:user&state=${state}`;
  };

  const loadMyData = async (t: string) => {
    const [myProductsRes, myCampaignsRes] = await Promise.all([
      fetch(`${API}/api/my-products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: t }) }),
      fetch(`${API}/api/campaigns/mine`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: t }) }),
    ]);
    const mpd = await myProductsRes.json();
    const mcd = await myCampaignsRes.json();
    setProducts(mpd.products || []);
    setCampaigns(mcd.campaigns || []);
    if (mpd.products?.length) setForm(f => ({ ...f, product_slug: mpd.products[0].slug }));
  };

  const createCampaign = async () => {
    if (!token) return login();
    if (!form.product_slug || !form.title || !form.cpu || !form.budget) { setMsg('Fill all required fields'); return; }
    setSaving(true); setMsg('');
    try {
      const res = await fetch(`${API}/api/campaigns/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, github_token: token }),
      });
      const d = await res.json();
      if (d.success) { setMsg(`✓ Campaign live! Users can now earn by trying ${form.product_slug}`); await loadMyData(token); }
      else setMsg(`Error: ${d.error}`);
    } finally { setSaving(false); }
  };

  const budget_pct = (c: Campaign) => Math.min(100, Math.round((c.budget_spent / c.budget) * 100));

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#eeeeff', fontFamily: "'Space Grotesk',sans-serif" }}>
      <nav style={{ background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.055)', padding: '0 28px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 15, fontWeight: 800, color: '#eeeeff', textDecoration: 'none', letterSpacing: '-0.03em' }}>NodeMeld</Link>
          <span style={{ fontSize: 9, padding: '3px 9px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.22)', borderRadius: 100, color: '#a855f7', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em' }}>FOUNDER CAMPAIGNS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!token
            ? <button onClick={login} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Connect GitHub</button>
            : <span style={{ fontSize: 11, color: '#22d98a', fontFamily: "'Space Mono',monospace" }}>✓ CONNECTED</span>
          }
          <Link href="/earn" style={{ fontSize: 12, color: 'rgba(238,238,255,0.4)', textDecoration: 'none', fontWeight: 600 }}>Earn as User →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 96px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(168,85,247,0.7)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>Performance marketing, reimagined</div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
            Pay only for<br />
            <span style={{ background: 'linear-gradient(120deg, #a855f7 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>real users.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(238,238,255,0.5)', maxWidth: 520, lineHeight: 1.75 }}>
            Set a cost-per-user (CPU). Users try your product and get paid when they complete a milestone. You only pay for verified human users who actually tried your SaaS.
          </p>
        </div>

        {!token ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(168,85,247,0.04)', border: '1px dashed rgba(168,85,247,0.2)', borderRadius: 16 }}>
            <div style={{ fontSize: 14, color: 'rgba(238,238,255,0.5)', marginBottom: 20 }}>Connect your GitHub to create a campaign</div>
            <button onClick={login} style={{ padding: '14px 36px', background: 'linear-gradient(130deg, #8b3cf7 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }}>
              Connect GitHub
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
            {/* Create form */}
            <div style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.055)', borderRadius: 14, padding: '28px 26px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 22, letterSpacing: '-0.02em' }}>Create Campaign</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>Product</label>
                  {products.length > 0 ? (
                    <select value={form.product_slug} onChange={e => setForm(f => ({ ...f, product_slug: e.target.value }))} style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#eeeeff', fontSize: 13, fontFamily: "'Space Mono',monospace", outline: 'none' }}>
                      {products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                    </select>
                  ) : (
                    <div style={{ fontSize: 12, color: 'rgba(238,238,255,0.35)', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                      No products yet — <Link href="/" style={{ color: '#a855f7', textDecoration: 'none' }}>claim a listing first</Link>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>Campaign Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Try our AI writing tool for free" style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#eeeeff', fontSize: 13, outline: 'none', fontFamily: "'Space Grotesk',sans-serif" }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will users do? What makes your product worth trying?" rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#eeeeff', fontSize: 13, outline: 'none', resize: 'none', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.6 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>Cost per User (¢)</label>
                    <input type="number" min={50} max={5000} value={form.cpu} onChange={e => setForm(f => ({ ...f, cpu: parseInt(e.target.value) || 100 }))} style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#22d98a', fontSize: 16, fontWeight: 800, outline: 'none', fontFamily: "'Space Mono',monospace" }} />
                    <div style={{ fontSize: 10, color: 'rgba(238,238,255,0.3)', marginTop: 4 }}>${(form.cpu / 100).toFixed(2)} per user</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>Total Budget ($)</label>
                    <input type="number" min={10} value={form.budget / 100} onChange={e => setForm(f => ({ ...f, budget: Math.round(parseFloat(e.target.value || '10') * 100) }))} style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#eeeeff', fontSize: 16, fontWeight: 800, outline: 'none', fontFamily: "'Space Mono',monospace" }} />
                    <div style={{ fontSize: 10, color: 'rgba(238,238,255,0.3)', marginTop: 4 }}>≈ {Math.floor(form.budget / form.cpu)} users</div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>Milestone (what counts as tried)</label>
                  <select value={form.milestone} onChange={e => setForm(f => ({ ...f, milestone: e.target.value }))} style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#eeeeff', fontSize: 13, fontFamily: "'Space Mono',monospace", outline: 'none' }}>
                    <option value="signup">Signed up</option>
                    <option value="onboarding">Completed onboarding</option>
                    <option value="core_feature">Used core feature</option>
                    <option value="30min">Spent 30+ minutes</option>
                  </select>
                </div>

                {msg && (
                  <div style={{ padding: '10px 14px', background: msg.startsWith('✓') ? 'rgba(34,217,138,0.08)' : 'rgba(244,63,94,0.08)', border: `1px solid ${msg.startsWith('✓') ? 'rgba(34,217,138,0.2)' : 'rgba(244,63,94,0.2)'}`, borderRadius: 8, fontSize: 12, color: msg.startsWith('✓') ? '#22d98a' : '#f43f5e', fontFamily: "'Space Mono',monospace" }}>
                    {msg}
                  </div>
                )}

                <button onClick={createCampaign} disabled={saving || !products.length} style={{ padding: '13px', background: 'linear-gradient(130deg, #8b3cf7, #6366f1)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.25)', letterSpacing: '0.04em', opacity: (saving || !products.length) ? 0.5 : 1 }}>
                  {saving ? 'Creating...' : 'Launch Campaign'}
                </button>
              </div>
            </div>

            {/* My campaigns */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(238,238,255,0.6)', marginBottom: 6 }}>Your Campaigns</div>
              {campaigns.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12, color: 'rgba(238,238,255,0.25)' }}>No campaigns yet</div>
              ) : campaigns.map(c => (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.055)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div>
                      <div style={{ fontSize: 10, color: 'rgba(238,238,255,0.35)', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>{c.product_slug} · ${(c.cpu / 100).toFixed(2)}/user</div>
                    </div>
                    <span style={{ fontSize: 9, padding: '3px 9px', background: c.status === 'active' ? 'rgba(34,217,138,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${c.status === 'active' ? 'rgba(34,217,138,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 100, color: c.status === 'active' ? '#22d98a' : 'rgba(238,238,255,0.35)', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.status}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${budget_pct(c)}%`, background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(238,238,255,0.3)', fontFamily: "'Space Mono',monospace" }}>
                    <span>${(c.budget_spent / 100).toFixed(2)} spent</span>
                    <span>${(c.budget / 100).toFixed(2)} budget · {budget_pct(c)}% used</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.055)' }}>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(238,238,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>How It Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { n:'01', title:'Set Your CPU', desc:'Define how much you pay per real user who completes your trial milestone. Min $0.50, max $50.' },
              { n:'02', title:'Users Try & Earn', desc:'Real people try your product and get paid when they complete signup, onboarding, or a core feature.' },
              { n:'03', title:'Pay for Results', desc:'Budget depletes only when milestones are confirmed. Every dollar goes to a verified human user.' },
            ].map(s => (
              <div key={s.n} style={{ background: 'rgba(255,255,255,0.016)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '22px 20px' }}>
                <div style={{ fontSize: 9, fontFamily: "'Space Mono',monospace", color: 'rgba(168,85,247,0.6)', letterSpacing: '0.2em', marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,238,255,0.45)', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
