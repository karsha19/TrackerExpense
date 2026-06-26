import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/add-income', label: 'Add Income', icon: '+' },
  { to: '/add-expense', label: 'Add Expense', icon: '−' },
  { to: '/transactions', label: 'Transactions', icon: '≡' },
]

export default function Layout() {
  const navigate = useNavigate()
  const name = localStorage.getItem('userName') || 'User'

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed',
        top: 0, left: 0, height: '100vh', zIndex: 10
      }}>
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700
            }}>₹</div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15 }}>SpendSmart</div>
              <div style={{ color: 'var(--text3)', fontSize: 11 }}>Expense Tracker</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 500,
              color: isActive ? '#fff' : 'var(--text2)',
              background: isActive ? 'var(--accent)' : 'transparent',
              transition: 'all 0.15s'
            })}>
              <span style={{ fontSize: 16, lineHeight: 1, width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 16px 0', borderTop: '1px solid var(--border)', margin: '0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600
            }}>{name[0]?.toUpperCase()}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '8px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)',
            cursor: 'pointer', fontSize: 13, textAlign: 'center'
          }}>Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
