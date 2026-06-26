import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const CATEGORIES = ['Food', 'Travel', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Others']

export default function AddExpense() {
  const [form, setForm] = useState({ amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0] })
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  // Debounced AI prediction
  useEffect(() => {
    if (!form.description || form.description.length < 3) return
    const timer = setTimeout(async () => {
      setPredicting(true)
      try {
        const res = await api.get(`/predict-category?description=${encodeURIComponent(form.description)}`)
        setAiSuggestion(res.data.category)
      } catch {}
      setPredicting(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [form.description])

  const applyAI = () => setForm({ ...form, category: aiSuggestion })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category) { alert('Please select a category'); return }
    setLoading(true)
    try {
      await api.post('/expense', form)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      alert('Failed to add expense')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Add Expense</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 14 }}>AI will suggest a category as you type</p>

      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '14px 18px', color: '#34d399', marginBottom: 20 }}>
          ✓ Expense added! Redirecting to dashboard...
        </div>
      )}

      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={label}>Amount (₹)</label>
            <input style={input} type="number" placeholder="500" min="0" step="0.01"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          </div>

          <div>
            <label style={label}>Description</label>
            <input style={input} placeholder="e.g. Dominos Pizza, Uber Ride..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

            {/* AI Suggestion */}
            {form.description.length >= 3 && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, flex: 1
                }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <span style={{ color: 'var(--text2)' }}>AI suggests:</span>
                  {predicting ? (
                    <span style={{ color: 'var(--text3)' }}>analyzing...</span>
                  ) : (
                    <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{aiSuggestion || '—'}</span>
                  )}
                </div>
                {aiSuggestion && !predicting && (
                  <button type="button" onClick={applyAI} style={{
                    padding: '8px 14px', background: 'var(--accent)', border: 'none',
                    borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'
                  }}>Use This</button>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={label}>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button type="button" key={cat} onClick={() => setForm({ ...form, category: cat })} style={{
                  padding: '10px 4px', borderRadius: 10, border: '1.5px solid',
                  borderColor: form.category === cat ? 'var(--accent)' : 'var(--border)',
                  background: form.category === cat ? 'rgba(108,99,255,0.15)' : 'var(--bg3)',
                  color: form.category === cat ? 'var(--accent2)' : 'var(--text2)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.15s'
                }}>{cat}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={label}>Date</label>
            <input style={input} type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '14px', background: 'var(--red)', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4
          }}>
            {loading ? 'Adding...' : '− Add Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}

const card = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }
const label = { display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text2)' }
const input = { width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none' }
