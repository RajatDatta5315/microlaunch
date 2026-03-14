'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nodemeld-api.kryv.workers.dev';
const KRYV_CLIENT_ID = 'Ov23li2oOtJSQKCUwIRr';
// GitHub OAuth removed — using PAT prompt

interface Campaign {
  id: number;
  product_slug: string;
  product_name: string;
  product_url: string;
  logo_url: string;
  category: string;
  title: string;
  description: string;
  cpu: number;
  budget: number;
  budget_spent: number;
  milestone: string;
}

interface Trial { campaign_id: number; status: string; earned_cents?: number; }
interface Earnings { balance_dollars: string; total_earned_cents: number; trials: Trial[]; }

export default function EarnPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [token, setToken] = useState('');
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(false);
  const [trialStatus, setTrialStatus] = useState<Record<number, string>>({});
  const [starting, setStarting] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API}/api/campaigns`).then(r => r.json()).then(d => setCampaigns(d.campaigns || []));
    // Handle OAuth return
    const params = new URLSearchParams(window.location.search);
    const t = params.get('github_token');
    if (t) {
      setToken(t);
      window.history.replaceState({}, '', '/earn');
      fetchEarnings(t);
    }
  }, []);

  const fetchEarnings = async (t: string) => {
    const res = await fetch(`${API}/api/earnings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: t }) });
    const d = await res.json();
    setEarnings(d);
    const map: Record<number, string> = {};
    (d.trials || []).forEach((tr: Trial) => { map[tr.campaign_id] = tr.status; });
    setTrialStatus(map);
  };

const login = () => {
    const clientId = process.env.NEXT_PUBLIC_NM_GH_CLIENT_ID || 'Ov23li2oOtJSQKCUwIRr';
    const isNewApp = clientId !== 'Ov23li2oOtJSQKCUwIRr';
    const redirect = encodeURIComponent(isNewApp
      ? 'https://nodemeld.kryv.network/api/github-callback'
      : 'https://velqa.kryv.network/portal');
    const state = encodeURIComponent(isNewApp
      ? 'redirect_path=/earn'
      : 'redirect:' + window.location.origin + '/earn');
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=read:user&state=${state}`;
  };

  const startTrial = async (campaignId: number, productUrl: string) => {
    if (!token) return login();
    setStarting(campaignId);
    try {
      const res = await fetch(`${API}/api/trials/start`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: token, campaign_id: campaignId }) });
      const d = await res.json();
      if (d.success) {
        setTrialStatus(prev => ({ ...prev, [campaignId]: 'started' }));
        window.open(productUrl, '_blank');
      }
    } finally { setStarting(null); }
  };

  const completeTrial = async (campaignId: number) => {
    if (!token) return;
    setLoading(true);
    const res = await fetch(`${API}/api/trials/complete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: token, campaign_id: campaignId }) });
    const d = await res.json();
    if (d.success) {
      setTrialStatus(prev => ({ ...prev, [campaignId]: 'completed' }));
      await fetchEarnings(token);
    }
    setLoading(false);
  };

  const budget_pct = (c: Campaign) => Math.min(100, Math.round((c.budget_spent / c.budget) * 100));
  const slots_left = (c: Campaign) => Math.floor((c.budget - c.budget_spent) / c.cpu);

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#eeeeff', fontFamily: "'Space Grotesk',sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.055)', padding: '0 28px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 15, fontWeight: 800, color: '#eeeeff', textDecoration: 'none', letterSpacing: '-0.03em' }}>NodeMeld</Link>
          <span style={{ fontSize: 9, padding: '3px 9px', background: 'rgba(34,217,138,0.1)', border: '1px solid rgba(34,217,138,0.22)', borderRadius: 100, color: '#22d98a', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em' }}>EARN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {earnings && (
            <div style={{ padding: '6px 14px', background: 'rgba(34,217,138,0.08)', border: '1px solid rgba(34,217,138,0.2)', borderRadius: 100, fontSize: 13, fontWeight: 700, color: '#22d98a' }}>
              ${earnings.balance_dollars} earned
            </div>
          )}
          {!token
            ? <button onClick={login} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>Connect GitHub</button>
            : <span style={{ fontSize: 11, color: 'rgba(238,238,255,0.4)', fontFamily: "'Space Mono',monospace" }}>✓ CONNECTED</span>
          }
          <Link href="/campaigns" style={{ fontSize: 12, color: 'rgba(238,238,255,0.4)', textDecoration: 'none', fontWeight: 600 }}>For Founders →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 96px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 52, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: 'rgba(168,85,247,0.7)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>Get paid to discover great software</div>
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 18 }}>
            Try products.<br />
            <span style={{ background: 'linear-gradient(120deg, #a855f7 0%, #6366f1 50%, #22d98a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get paid.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(238,238,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            SaaS founders pay real money for real users. Try a product, complete the milestone, earn instantly. No surveys. No ads. Just you using software that needs real feedback.
          </p>
          {!token && (
            <button onClick={login} style={{ marginTop: 28, padding: '14px 36px', background: 'linear-gradient(130deg, #8b3cf7 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.3)', letterSpacing: '0.04em' }}>
              Connect GitHub to Start Earning
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 44 }}>
          {[
            { label: 'Active Campaigns', value: campaigns.length.toString() },
            { label: 'Avg Reward', value: campaigns.length ? `$${(campaigns.reduce((s,c) => s + c.cpu, 0) / campaigns.length / 100).toFixed(2)}` : '$—' },
            { label: 'Total Slots', value: campaigns.reduce((s,c) => s + slots_left(c), 0).toString() },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.055)', borderRadius: 12, padding: '20px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(238,238,255,0.35)', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Campaign grid */}
        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: 'rgba(238,238,255,0.3)' }}>No active campaigns yet — <Link href="/campaigns" style={{ color: '#a855f7', textDecoration: 'none' }}>be the first founder to launch one</Link></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
            {campaigns.map(c => {
              const status = trialStatus[c.id];
              const pct = budget_pct(c);
              const left = slots_left(c);
              return (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.022)', border: `1px solid ${status === 'completed' ? 'rgba(34,217,138,0.3)' : status === 'started' ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.055)'}`, borderRadius: 14, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.2s' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={c.logo_url || `https://logo.clearbit.com/${c.product_slug}.com`} alt={c.product_name} width={36} height={36} style={{ borderRadius: 9, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.06)' }} onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${c.product_name}&background=6366f1&color=fff&size=36`; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>{c.product_name || c.product_slug}</div>
                      <div style={{ fontSize: 10, color: 'rgba(238,238,255,0.35)', fontFamily: "'Space Mono',monospace" }}>{c.category}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#22d98a', letterSpacing: '-0.03em' }}>${(c.cpu / 100).toFixed(2)}</div>
                      <div style={{ fontSize: 9, color: 'rgba(238,238,255,0.3)', fontFamily: "'Space Mono',monospace" }}>per trial</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                    {c.description && <div style={{ fontSize: 12, color: 'rgba(238,238,255,0.45)', lineHeight: 1.65 }}>{c.description}</div>}
                  </div>

                  {/* Milestone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 9, padding: '3px 9px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, color: '#a855f7', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Complete: {c.milestone}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(238,238,255,0.3)', fontFamily: "'Space Mono',monospace" }}>{left} slots left</span>
                  </div>

                  {/* Budget bar */}
                  <div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? '#f59e0b' : 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(238,238,255,0.25)', marginTop: 4, fontFamily: "'Space Mono',monospace" }}>{pct}% budget used</div>
                  </div>

                  {/* Action */}
                  {status === 'completed' ? (
                    <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, color: '#22d98a', fontWeight: 700 }}>✓ Completed — reward credited</div>
                  ) : status === 'started' ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href={c.product_url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', textAlign: 'center', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 8, fontSize: 12, color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>Open Product ↗</a>
                      <button onClick={() => completeTrial(c.id)} disabled={loading} style={{ flex: 1, padding: '10px', background: '#22d98a', border: 'none', borderRadius: 8, fontSize: 12, color: '#050508', fontWeight: 800, cursor: 'pointer' }}>
                        {loading ? '...' : 'I Tried It ✓'}
                      </button>
                    </div>
                  ) : left > 0 ? (
                    <button onClick={() => startTrial(c.id, c.product_url)} disabled={starting === c.id} style={{ padding: '12px', background: 'linear-gradient(130deg, #8b3cf7, #6366f1)', border: 'none', borderRadius: 8, fontSize: 13, color: '#fff', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.03em', boxShadow: '0 4px 20px rgba(99,102,241,0.25)' }}>
                      {starting === c.id ? 'Starting...' : `Earn $${(c.cpu / 100).toFixed(2)} — Try Now`}
                    </button>
                  ) : (
                    <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, color: 'rgba(238,238,255,0.3)' }}>Budget exhausted</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
