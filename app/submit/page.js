'use client';
import { useState } from 'react';

export default function Submit() {
  const [form, setForm] = useState({ name: '', url: '', description: '', pricing: '', category: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setStatus('✅ Submitted! Your product is now live.');
      setForm({ name: '', url: '', description: '', pricing: '', category: '' });
    } else {
      setStatus('❌ Error');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)', 
        borderRadius: '20px', 
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ color: 'white' }}>Submit Your SaaS</h1>
        <form onSubmit={submit}>
          <input required placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} />
          <input required placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} />
          <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none', minHeight: '100px' }} />
          <input placeholder="Pricing (e.g. $9/mo)" value={form.pricing} onChange={e => setForm({...form, pricing: e.target.value})} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} />
          <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: 'none' }} />
          <button type="submit" style={{ padding: '14px 28px', background: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Submit</button>
        </form>
        <p style={{ color: 'white', marginTop: '20px' }}>{status}</p>
      </div>
    </div>
  );
}
