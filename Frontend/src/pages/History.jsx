import { useEffect, useState } from 'react'
import { TrendChart } from '../components/ForecastChart'
import HistoryTable from '../components/HistoryTable'
import { fetchHistory } from '../api/forecastApi'

const MOCK_HISTORY = Array.from({ length: 10 }, (_, i) => ({
  prev_consumption: 260 + i * 12 + Math.random() * 40,
  predicted: 270 + i * 11 + Math.random() * 38,
  temperature: 20 + Math.random() * 18,
  season: ['Summer','Monsoon','Winter','Spring','Autumn'][i % 5],
  timestamp: new Date(Date.now() - (9 - i) * 28 * 86400000).toISOString(),
}))

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
      .then(setHistory)
      .catch(() => setHistory(MOCK_HISTORY))
      .finally(() => setLoading(false))
  }, [])

  const avg = history.length
    ? (history.reduce((s, h) => s + h.predicted, 0) / history.length).toFixed(1)
    : '—'

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'40px 24px' }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom:'36px' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.15em',
          color:'var(--accent)', textTransform:'uppercase', marginBottom:'8px' }}>
          Prediction Log
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem, 4vw, 3rem)',
          lineHeight:1, letterSpacing:'0.03em' }}>
          FORECAST<br/><span style={{ color:'var(--accent)' }}>HISTORY</span>
        </h1>
      </div>

      {/* Stats strip */}
      <div className="fade-up-1" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Total Predictions', value: history.length, unit:'' },
          { label:'Avg Prediction',    value: avg,             unit:'kWh' },
          { label:'Latest Entry',      value: history.length
            ? new Date(history[history.length-1]?.timestamp).toLocaleDateString()
            : '—', unit:'' },
        ].map(({ label, value, unit }) => (
          <div key={label} style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'18px 20px', boxShadow:'var(--shadow)',
          }}>
            <div style={{ fontSize:'10px', color:'var(--text3)', letterSpacing:'0.1em',
              textTransform:'uppercase', marginBottom:'8px' }}>{label}</div>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--accent)', lineHeight:1 }}>{value}</span>
            {unit && <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text3)', marginLeft:'4px' }}>{unit}</span>}
          </div>
        ))}
      </div>

      {/* Trend chart */}
      {history.length > 1 && (
        <div className="fade-up-2" style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'var(--radius-lg)', padding:'24px',
          boxShadow:'var(--shadow)', marginBottom:'20px',
        }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem',
            letterSpacing:'0.06em', marginBottom:'18px' }}>
            CONSUMPTION TREND
          </h3>
          <TrendChart history={history} />
        </div>
      )}

      {/* Table */}
      <div className="fade-up-3" style={{
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow)',
      }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', letterSpacing:'0.06em' }}>
            ALL PREDICTIONS
          </h3>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text3)' }}>
            {history.length} records
          </span>
        </div>
        {loading
          ? <div style={{ padding:'40px', textAlign:'center', color:'var(--text3)',
              fontFamily:'var(--font-mono)', fontSize:'12px' }}>Loading...</div>
          : <HistoryTable history={history} />
        }
      </div>
    </div>
  )
}