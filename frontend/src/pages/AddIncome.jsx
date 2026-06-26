import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const SOURCES = ['Salary', 'Freelancing', 'Business', 'Investment', 'Gift', 'Other']

export default function AddIncome() {
  const [form, setForm] = useState({ amount: '', source: '', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.source) { alert('Please select a source'); return }
    setLoading(true)
    try {
      await api.post('/income', form)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1200)
    } catch {
      alert('Failed to add income')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Add Income</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 14 }}>Record your earnings</p>

      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '14px 18px', color: '#34d399', marginBottom: 20 }}>
          ✓ Income added! Redirecting to dashboard...
        </div>
      )}

      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={label}>Amount (₹)</label>
            <input style={input} type="number" placeholder="20000" min="0" step="0.01"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          </div>

          <div>
            <label style={label}>Source</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              {SOURCES.map(src => (
                <button type="button" key={src} onClick={() => setForm({ ...form, source: src })} style={{
                  padding: '11px 4px', borderRadius: 10, border: '1.5px solid',
                  borderColor: form.source === src ? 'var(--green)' : 'var(--border)',
                  background: form.source === src ? 'rgba(16,185,129,0.15)' : 'var(--bg3)',
                  color: form.source === src ? '#34d399' : 'var(--text2)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s'
                }}>{src}</button>
              ))}
            </div>
            <input style={input} placeholder="Or type custom source..."
              value={SOURCES.includes(form.source) ? '' : form.source}
              onChange={e => setForm({ ...form, source: e.target.value })} />
          </div>

          <div>
            <label style={label}>Date</label>
            <input style={input} type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '14px', background: 'var(--green)', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4
          }}>
            {loading ? 'Adding...' : '+ Add Income'}
          </button>
        </form>
      </div>
    </div>
  )
}

const card = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }
const label = { display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text2)' }
const input = { width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none' }
