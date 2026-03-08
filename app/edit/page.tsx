'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nodemeld-api.kryv.workers.dev';
const GITHUB_CLIENT_ID = 'Ov23li2oOtJSQKCUwIRr';
const CATEGORIES = ['AI', 'Marketing', 'Development', 'Deep Tech', 'Security', 'Finance', 'Productivity', 'Social', 'Other'];

export default function EditPage() {
  const [step, setStep] = useState<'login'|'select'|'edit'|'done'>('login');
  const [token, setToken] = useState('');
  const [ghUser, setGhUser] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ name:'', description:'', logo_url:'', pricing:'', category:'', url:'' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) { window.history.replaceState({}, '', '/edit'); exchangeCode(code); }
    const saved = localStorage.getItem('nodemeld_gh_token');
    if (saved) { setToken(saved); fetchUser(saved); }
  }, []);

  const startOAuth = () => {
    const redirect = encodeURIComponent(`${window.location.origin}/edit`);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=read:user&redirect_uri=${redirect}`;
  };

  const exchangeCode = async (code: string) => {
    setLoading(true); setStatus('Authenticating...');
    try {
      const res = await fetch(`${API}/api/github/callback?code=${code}`);
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('nodemeld_gh_token', data.access_token);
        setToken(data.access_token);
        fetchUser(data.access_token);
      } else setStatus(`Auth failed: ${data.error}`);
    } catch (e: any) { setStatus(`Error: ${e.message}`); }
    setLoading(false);
  };

  const fetchUser = async (t: string) => {
    setLoading(true);
    try {
      const ghRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${t}`, 'User-Agent': 'NodeMeld-KRYV' } });
      const user = await ghRes.json();
      setGhUser(user);
      const prodRes = await fetch(`${API}/api/my-products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: t }) });
      const d = await prodRes.json();
      setMyProducts(d.products || []);
      setStep('select');
    } catch (e: any) { setStatus(`Error: ${e.message}`); }
    setLoading(false);
  };

  const selectProduct = (p: any) => {
    setSelected(p);
    setForm({ name: p.name||'', description: p.description||'', logo_url: p.logo_url||'', pricing: p.pricing||'', category: p.category||'', url: p.url||'' });
    setStep('edit');
  };

  const saveChanges = async () => {
    setLoading(true); setStatus('Saving...');
    try {
      const res = await fetch(`${API}/api/edit/${selected.slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ github_token: token, ...form }) });
      const data = await res.json();
      if (data.success) { setStatus('✅ Saved!'); setStep('done'); }
      else setStatus(`❌ ${data.error}`);
    } catch (e: any) { setStatus(`Error: ${e.message}`); }
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem('nodemeld_gh_token'); setToken(''); setGhUser(null); setMyProducts([]); setStep('login'); setStatus(''); };

  const inp = { width:'100%', background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'11px 14px', color:'#e0e0e0', fontSize:13, outline:'none', boxSizing:'border-box' as const, marginBottom:14 };
  const lbl = { fontSize:11, fontWeight:700 as const, color:'#555', display:'block' as const, marginBottom:5, textTransform:'uppercase' as const, letterSpacing:'0.07em' };

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', fontFamily:"'Space Grotesk',-apple-system,sans-serif", color:'#e0e0e0', padding:'40px 20px' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800;900&display=swap" />
      <div style={{ textAlign:'center', marginBottom:36 }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:'#fff', letterSpacing:'-0.02em', marginBottom:8 }}>Manage Your Listing</h1>
        <p style={{ fontSize:13, color:'#444' }}>Sign in with GitHub to claim, update, and manage your NodeMeld listing.</p>
      </div>
      <div style={{ maxWidth:540, margin:'0 auto', background:'#101018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:36 }}>
        {status && <div style={{ padding:'10px 14px', borderRadius:10, background: status.startsWith('✅') ? 'rgba(74,222,128,0.08)' : status.startsWith('❌') ? 'rgba(239,68,68,0.08)' : 'rgba(102,126,234,0.08)', border:`1px solid ${status.startsWith('✅') ? 'rgba(74,222,128,0.2)' : status.startsWith('❌') ? 'rgba(239,68,68,0.2)' : 'rgba(102,126,234,0.2)'}`, color: status.startsWith('✅') ? '#4ade80' : status.startsWith('❌') ? '#f87171' : '#a5b4fc', fontSize:13, marginBottom:20 }}>{status}</div>}

        {step === 'login' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:44, marginBottom:18 }}>🔐</div>
            <h2 style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:8 }}>Sign in with GitHub</h2>
            <p style={{ fontSize:13, color:'#555', marginBottom:28, lineHeight:1.6 }}>We use the KRYV OAuth app to verify your identity. Only your username is read — no write access to your GitHub.</p>
            <button onClick={startOAuth} disabled={loading}
              style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'13px 28px', background:'#fff', color:'#0a0a0f', borderRadius:12, border:'none', fontSize:14, fontWeight:800, cursor:'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
            <p style={{ marginTop:16, fontSize:11, color:'#333' }}>Powered by KRYV OAuth — same app across all 28 KRYV projects</p>
          </div>
        )}

        {step === 'select' && (
          <div>
            {ghUser && <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, padding:'10px 14px', background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.12)', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <img src={ghUser.avatar_url} alt="" width={26} height={26} style={{ borderRadius:'50%' }} />
                <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>@{ghUser.login}</span>
                <span style={{ fontSize:11, color:'#4ade80' }}>✓</span>
              </div>
              <button onClick={logout} style={{ fontSize:11, color:'#444', background:'none', border:'none', cursor:'pointer' }}>Sign out</button>
            </div>}
            <h2 style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:5 }}>Your listings ({myProducts.length})</h2>
            <p style={{ fontSize:12, color:'#555', marginBottom:16 }}>{myProducts.length === 0 ? 'No claimed listings yet — find your product on NodeMeld and click Claim.' : 'Select a listing to edit.'}</p>
            {myProducts.length > 0 && <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
              {myProducts.map(p => (
                <div key={p.slug} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>
                  <img src={p.logo_url || `https://ui-avatars.com/api/?name=${p.name[0]}&background=667eea&color=fff&size=34`} alt="" width={34} height={34} style={{ borderRadius:8, objectFit:'cover' }} onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${p.name[0]}&background=667eea&color=fff`; }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'#444', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.url}</div>
                  </div>
                  <button onClick={() => selectProduct(p)} style={{ padding:'7px 14px', background:'linear-gradient(135deg,#667eea,#764ba2)', border:'none', borderRadius:8, color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>Edit</button>
                </div>
              ))}
            </div>}
            <div style={{ padding:'12px 14px', background:'rgba(102,126,234,0.05)', border:'1px solid rgba(102,126,234,0.12)', borderRadius:10 }}>
              <div style={{ fontSize:12, color:'#667eea', fontWeight:700, marginBottom:3 }}>Not listed yet?</div>
              <a href="/" style={{ fontSize:12, color:'#555' }}>Go to NodeMeld → find your product → click Claim to link it to your GitHub</a>
            </div>
          </div>
        )}

        {step === 'edit' && selected && (
          <div>
            <button onClick={() => setStep('select')} style={{ background:'none', border:'none', color:'#555', fontSize:12, cursor:'pointer', marginBottom:18, padding:0 }}>← Back</button>
            <h2 style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:3 }}>Editing: {selected.name}</h2>
            <p style={{ fontSize:11, color:'#555', marginBottom:20 }}>Leave fields blank to keep existing value.</p>
            {[
              { label:'Product Name', key:'name', placeholder:selected.name },
              { label:'Logo URL', key:'logo_url', placeholder:'https://logo.clearbit.com/yourapp.com' },
              { label:'Website URL', key:'url', placeholder:'https://yourapp.com' },
              { label:'Pricing', key:'pricing', placeholder:'Free / Freemium / $9/mo' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                {key === 'logo_url' ? (
                  <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
                    <input style={{ ...inp, marginBottom:0, flex:1 }} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                    {(form as any)[key] && <img src={(form as any)[key]} alt="" width={30} height={30} style={{ borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />}
                  </div>
                ) : <input style={inp} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />}
              </div>
            ))}
            <label style={lbl}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does your SaaS do?"
              style={{ ...inp, resize:'vertical', minHeight:80 }} />
            <label style={lbl}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, appearance:'none', cursor:'pointer' }}>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={saveChanges} disabled={loading} style={{ width:'100%', padding:13, background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:800, cursor:'pointer', marginTop:4 }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:50, marginBottom:16 }}>✅</div>
            <h2 style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:8 }}>Listing updated!</h2>
            <p style={{ fontSize:13, color:'#555', marginBottom:24 }}>Your changes are live on NodeMeld.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <a href="/" style={{ padding:'11px 20px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#e0e0e0', textDecoration:'none', fontSize:13, fontWeight:700 }}>View NodeMeld</a>
              <button onClick={() => { setStep('select'); setStatus(''); }} style={{ padding:'11px 20px', background:'linear-gradient(135deg,#667eea,#764ba2)', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>Edit Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
