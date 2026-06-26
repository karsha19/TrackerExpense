import { useEffect, useState } from 'react'
import api from '../api'

const CATEGORY_ICONS = {
  Food: '🍔', Travel: '🚕', Entertainment: '🎬', Bills: '📋',
  Shopping: '🛍️', Health: '💊', Education: '📚', Others: '💰'
}

export default function Transactions() {
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [tab, setTab] = useState('expense')
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    const [e, i] = await Promise.all([api.get('/expense'), api.get('/income')])
    setExpenses(e.data)
    setIncomes(i.data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const deleteExpense = async (id) => {
    await api.delete(`/expense/${id}`)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const deleteIncome = async (id) => {
    await api.delete(`/income/${id}`)
    setIncomes(prev => prev.filter(i => i.id !== id))
  }

  if (loading) return <div style={{ color: 'var(--text2)' }}>Loading...</div>

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Transactions</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 14 }}>All your income and expenses</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['expense', 'income'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tab === t ? (t === 'expense' ? 'var(--red)' : 'var(--green)') : 'var(--bg3)',
            color: tab === t ? '#fff' : 'var(--text2)', fontWeight: 500, fontSize: 14
          }}>{t === 'expense' ? 'Expenses' : 'Income'}</button>
        ))}
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {tab === 'expense' ? (
          expenses.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>No expenses yet</div>
          ) : expenses.map((e, i) => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', padding: '16px 20px',
              borderBottom: i < expenses.length - 1 ? '1px solid var(--border)' : 'none',
              gap: 14
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: 'var(--bg3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
              }}>{CATEGORY_ICONS[e.category] || '💰'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{e.description}</div>
                <div style={{ color: 'var(--text3)', fontSize: 12 }}>{e.category} · {e.date}</div>
              </div>
              <div style={{ color: 'var(--red)', fontWeight: 600, fontFamily: 'Space Grotesk', marginRight: 12 }}>
                −₹{e.amount.toLocaleString('en-IN')}
              </div>
              <button onClick={() => deleteExpense(e.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
                fontSize: 18, lineHeight: 1, padding: '4px 8px', borderRadius: 6
              }}>×</button>
            </div>
          ))
        ) : (
          incomes.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>No income yet</div>
          ) : incomes.map((inc, i) => (
            <div key={inc.id} style={{
              display: 'flex', alignItems: 'center', padding: '16px 20px',
              borderBottom: i < incomes.length - 1 ? '1px solid var(--border)' : 'none',
              gap: 14
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
              }}>💵</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{inc.source}</div>
                <div style={{ color: 'var(--text3)', fontSize: 12 }}>{inc.date}</div>
              </div>
              <div style={{ color: 'var(--green)', fontWeight: 600, fontFamily: 'Space Grotesk', marginRight: 12 }}>
                +₹{inc.amount.toLocaleString('en-IN')}
              </div>
              <button onClick={() => deleteIncome(inc.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
                fontSize: 18, lineHeight: 1, padding: '4px 8px', borderRadius: 6
              }}>×</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
