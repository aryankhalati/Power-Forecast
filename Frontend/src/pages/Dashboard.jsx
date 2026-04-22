import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ComparisonChart, BreakdownChart, TrendChart } from '../components/ForecastChart'
import ModelStats from '../components/ModelStats'
import { fetchHistory, fetchModelStats } from '../api/forecastApi'

// Mock data for development
const MOCK_HISTORY = Array.from({ length: 8 }, (_, i) => ({
  prev_consumption: 280 + i * 15 + Math.random() * 30,
  predicted: 290 + i * 15 + Math.random() * 35,
  temperature: 22 + Math.random() * 15,
  season: ['Summer','Monsoon','Winter','Spring'][i % 4],
  timestamp: new Date(Date.now() - (7 - i) * 30 * 86400000).toISOString(),
}))

const MOCK_STATS = { r2: 0.924, mae: 14.3, rmse: 18.7, train_size: 850 }

const Card = ({ title, children, style }) => (
  <div style={{
    background:'var(--bg2)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-lg)', padding:'24px',
    boxShadow:'var(--shadow)', ...style,
  }}>
    {title && (
      <div style={{ marginBottom:'18px', display:'flex', alignItems:'center', gap:'8px' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', letterSpacing:'0.06em' }}>
          {title}
        </h3>
      </div>
    )}
    {children}
  </div>
)

export default function Dashboard() {
  const { state }   = useLocation()
  const navigate    = useNavigate()
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [stats,   setStats]   = useState(MOCK_STATS)
  const result = state?.result

  useEffect(() => {
    fetchHistory().then(setHistory).catch(() => setHistory(MOCK_HISTORY))
    fetchModelStats().then(setStats).catch(() => setStats(MOCK_STATS))
  }, [])

  if (!result) return (
    <div style={{ maxWidth:'900px', margin:'80px auto', textAlign:'center', padding:'24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'var(--text3)', marginBottom:'20px' }}>
        No prediction data. Run a forecast first.
      </div>
      <button onClick={() => navigate('/')} style={{
        padding:'10px 24px', borderRadius:'10px', cursor:'pointer',
        background:'var(--accent)', border:'none', color:'#0a0a0f',
        fontFamily:'var(--font-body)', fontWeight:600, fontSize:'14px',
      }}>
        ← Go to Forecast
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 24px' }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom:'36px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.12em',
            color:'var(--accent)', textTransform:'uppercase', marginBottom:'8px' }}>
            Forecast Dashboard
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem, 4vw, 3rem)',
            lineHeight:1, letterSpacing:'0.03em' }}>
            ANALYSIS<br/><span style={{ color:'var(--accent)' }}>RESULTS</span>
          </h1>
        </div>
        <button onClick={() => navigate('/')} style={{
          padding:'8px 18px', borderRadius:'8px', cursor:'pointer',
          background:'transparent', border:'1px solid var(--border)',
          color:'var(--text2)', fontFamily:'var(--font-body)', fontSize:'13px', transition:'all 0.2s',
        }}
          onMouseEnter={e => e.target.style.borderColor='var(--accent)'}
          onMouseLeave={e => e.target.style.borderColor='var(--border)'}
        >
          ← New Forecast
        </button>
      </div>

      {/* Top KPIs */}
      <div className="fade-up-1" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Prediction',    value:`${result.predicted.toFixed(1)}`, unit:'kWh', color:'var(--accent)' },
          { label:'Vs Last Month', value:`${result.predicted > result.prev_consumption ? '+' : ''}${(result.predicted - result.prev_consumption).toFixed(1)}`, unit:'kWh',
            color: result.predicted > result.prev_consumption ? '#ff6b35' : 'var(--green)' },
          { label:'Confidence',    value:`${result.confidence ?? 92}`, unit:'%',  color:'var(--blue)' },
          { label:'Model R²',      value: stats?.r2?.toFixed(3) ?? '0.924', unit:'', color:'var(--green)' },
        ].map(({ label, value, unit, color }) => (
          <div key={label} style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', padding:'18px 20px',
            boxShadow:'var(--shadow)',
          }}>
            <div style={{ fontSize:'10px', color:'var(--text3)', letterSpacing:'0.1em',
              textTransform:'uppercase', marginBottom:'8px' }}>{label}</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'4px' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color, lineHeight:1 }}>{value}</span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text3)', marginBottom:'3px' }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="fade-up-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
        <Card title="PREDICTED VS PREVIOUS">
          <ComparisonChart predicted={result.predicted} previous={result.inputs?.square_footage / 20 ?? 70} />
        </Card>
        <Card title="ESTIMATED BREAKDOWN">
          <BreakdownChart predicted={result.predicted} />
        </Card>
      </div>

      {/* Trend + stats */}
      <div className="fade-up-3" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px' }}>
        <Card title="HISTORICAL TREND">
          <TrendChart history={history} />
        </Card>
        <Card title="MODEL PERFORMANCE">
          <ModelStats stats={stats} />
        </Card>
      </div>
    </div>
  )
}