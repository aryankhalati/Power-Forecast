import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import History from './pages/History'

export default function App() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <main style={{ flex:1 }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history"   element={<History />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop:'1px solid var(--border)',
        padding:'20px 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'var(--bg2)',
      }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text3)' }}>
          ⚡ Power Forecast — Linear Regression Energy Forecaster
        </span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text3)' }}>
          React + Flask + Chart.js
        </span>
      </footer>
    </div>
  )
}