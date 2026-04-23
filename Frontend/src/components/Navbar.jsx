import { NavLink } from 'react-router-dom'

const BoltIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.09 12.96a.5.5 0 0 0 .41.79H11l-1 8.25L19.91 11.04a.5.5 0 0 0-.41-.79H13L14 2z"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(240,192,64,0.15)"/>
  </svg>
)

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '60px',
    }}>
      <NavLink to="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
        <span style={{ color:'var(--accent)' }}><BoltIcon /></span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', letterSpacing:'0.05em', color:'var(--text)' }}>
         POWER <span style={{ color:'var(--accent)' }}>FORECAST</span>
        </span>
      </NavLink>

      <div style={{ display:'flex', gap:'6px' }}>
        {[
          { to: '/',          label: 'Forecast' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/history',   label: 'History' },
        ].map(({ to, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            textDecoration: 'none',
            padding: '6px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: isActive ? 'var(--accent)' : 'var(--text2)',
            background: isActive ? 'rgba(240,192,64,0.1)' : 'transparent',
            border: isActive ? '1px solid rgba(240,192,64,0.2)' : '1px solid transparent',
            transition: 'all 0.2s',
          })}>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}