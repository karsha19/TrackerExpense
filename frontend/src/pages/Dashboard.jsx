import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../api'

const COLORS = ['#6c63ff', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6', '#ec4899']

const CATEGORY_ICONS = {
  Food: '🍔', Travel: '🚕', Entertainment: '🎬', Bills: '📋',
  Shopping: '🛍️', Health: '💊', Education: '📚', Others: '💰'
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const name = localStorage.getItem('userName') || 'User'

  useEffect(() => {
    api.get('/dashboard').then(r => { setData(r.data); setLoading(false) })
  }, [])

  if (loading) return <div style={{ color: 'var(--text2)', padding: 40 }}>Loading dashboard...</div>

  const pieData = data.category_breakdown.map(c => ({ name: c.category, value: c.amount }))

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Hello, {name} 👋</h1>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Income" value={data.total_income} color="var(--green)" icon="↑" />
        <StatCard label="Total Expense" value={data.total_expense} color="var(--red)" icon="↓" />
        <StatCard label="Balance" value={data.balance} color={data.balance >= 0 ? 'var(--accent)' : 'var(--red)'} icon="₹" />
      </div>

      {/* Chart + Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pie Chart */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Expense by Category</h3>
          {pieData.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 0' }}>No expenses yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 600 }}>Category Breakdown</h3>
          {data.category_breakdown.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 0' }}>No expenses yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.category_breakdown.sort((a, b) => b.amount - a.amount).map((cat, i) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{CATEGORY_ICONS[cat.category] || '💰'}</span>
                      {cat.category}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>₹{cat.amount.toFixed(0)} · {cat.percentage}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4 }}>
                    <div style={{ height: 6, width: `${cat.percentage}%`, background: COLORS[i % COLORS.length], borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
      <div style={{ color: 'var(--text2)', fontSize: 13, fontWeight: 500, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'Space Grotesk' }}>
        ₹{Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
      </div>
      <div style={{
        position: 'absolute', top: 16, right: 16, width: 36, height: 36,
        borderRadius: 10, background: color + '20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: 18, fontWeight: 700
      }}>{icon}</div>
    </div>
  )
}

const cardStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: 24
}
