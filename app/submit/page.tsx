'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Submit() {
  const [form, setForm] = useState({ name: '', url: '', description: '', pricing: '', category: '', logo_url: '' });
  const [status, setStatus] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    if (form.category) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/similar?category=${form.category}`)
        .then(r => r.json())
        .then(setCompetitors);
    }
  }, [form.category]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        alert('Logo too large! Max 2MB. Try compressing at tinypng.com');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setForm({ ...form, logo_url: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('⏳ Submitting...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Live at nodemeld.kryv.network/product/${data.slug}`);
        setForm({ name: '', url: '', description: '', pricing: '', category: '', logo_url: '' });
        setLogoPreview('');
        setCompetitors([]);
      } else {
        setStatus('❌ ' + (data.error || 'Error'));
      }
    } catch (err) {
      setStatus('❌ Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>

        <h1 style={{ fontSize: '48px', marginTop: '20px', marginBottom: '10px', fontWeight: 900 }}>Submit Your SaaS</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '16px' }}>
          Free • Auto-approved • Live instantly
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: competitors.length > 0 ? '2fr 1fr' : '1fr', gap: '30px' }}>
          
          {/* Form */}
          <form onSubmit={submit} className="glass" style={{ padding: '40px', borderRadius: '20px' }}>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Logo (Max 2MB)</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
              {logoPreview && <img src={logoPreview} alt="Preview" style={{ width: '60px', height: '60px', marginTop: '10px', borderRadius: '10px' }} />}
            </div>

            <input required placeholder="Product Name (e.g., Notion)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="glass" style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', color: 'white', outline: 'none' }} />
            
            <input required type="url" placeholder="Website URL (https://...)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="glass" style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', color: 'white', outline: 'none' }} />
            
            <textarea required placeholder="Description - MINIMUM 50 characters (Describe what your SaaS does, who it's for, key features...)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="glass" style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', minHeight: '120px', color: 'white', outline: 'none' }} />
            <p style={{ fontSize: '12px', color: form.description.length < 50 ? '#ff6b6b' : '#667eea', marginTop: '-8px' }}>
              {form.description.length}/50 minimum characters
            </p>
            
            <input placeholder="Pricing (e.g., $9/mo, Free, $99/year)" value={form.pricing} onChange={e => setForm({...form, pricing: e.target.value})} className="glass" style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', color: 'white', outline: 'none' }} />
            
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="glass" style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', color: 'white', outline: 'none' }}>
              <option value="">Select Category</option>
              <option value="Productivity">Productivity</option>
              <option value="Marketing">Marketing</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="AI">AI</option>
              <option value="Analytics">Analytics</option>
            </select>
            
            <button type="submit" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '16px' }}>
              🚀 Submit
            </button>
          </form>

          {/* Competitors */}
          {competitors.length > 0 && (
            <div className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Similar SaaS in {form.category}</h3>
              {competitors.map(c => (
                <div key={c.id} style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{c.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>▲ {c.upvotes || 0} upvotes</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {status && (
          <div className="glass" style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: status.includes('✅') ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)', color: 'white' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
