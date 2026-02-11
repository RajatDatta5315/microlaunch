'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Submit() {
  const [form, setForm] = useState({ name: '', url: '', description: '', pricing: '', category: '' });
  const [status, setStatus] = useState('');

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
        setStatus(`✅ Success! Your product is LIVE at nodemeld.kryv.network/product/${data.slug}`);
        setForm({ name: '', url: '', description: '', pricing: '', category: '' });
      } else {
        setStatus('❌ Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setStatus('❌ Network error');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '20px', 
        padding: '50px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>← Back</Link>
        
        <h1 style={{ color: 'white', fontSize: '36px', marginTop: '20px' }}>Submit Your SaaS</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>Auto-approved • Live instantly • Free forever</p>
        
        <form onSubmit={submit}>
          <input 
            required 
            placeholder="Product Name *" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', border: 'none', fontSize: '15px' }} 
          />
          <input 
            required 
            type="url"
            placeholder="Website URL * (https://...)" 
            value={form.url} 
            onChange={e => setForm({...form, url: e.target.value})} 
            style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', border: 'none', fontSize: '15px' }} 
          />
          <textarea 
            required 
            placeholder="Description * (Min 50 chars)" 
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
            style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', border: 'none', minHeight: '120px', fontSize: '15px' }} 
          />
          <input 
            placeholder="Pricing (e.g. $9/mo, Free, Freemium)" 
            value={form.pricing} 
            onChange={e => setForm({...form, pricing: e.target.value})} 
            style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', border: 'none', fontSize: '15px' }} 
          />
          <select 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})} 
            style={{ width: '100%', padding: '14px', margin: '12px 0', borderRadius: '10px', border: 'none', fontSize: '15px' }}
          >
            <option value="">Select Category</option>
            <option value="Productivity">Productivity</option>
            <option value="Marketing">Marketing</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="AI">AI</option>
            <option value="Analytics">Analytics</option>
            <option value="Other">Other</option>
          </select>
          
          <button 
            type="submit" 
            style={{ 
              padding: '16px 32px', 
              background: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              marginTop: '20px',
              fontSize: '16px'
            }}
          >
            🚀 Submit (Free & Instant)
          </button>
        </form>
        
        {status && (
          <div style={{ 
            marginTop: '30px', 
            padding: '16px', 
            background: status.includes('✅') ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)', 
            borderRadius: '10px',
            color: 'white'
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
