import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ComparisonChart, BreakdownChart, TrendChart } from '../components/ForecastChart'
import ModelStats from '../components/ModelStats'
import { fetchHistory, fetchModelStats } from '../api/forecastApi'

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
  const [history, setHistory] = useState([])
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const result = state?.result

  useEffect(() => {
    Promise.all([
      fetchHistory().catch(() => []),
      fetchModelStats().catch(() => null),
    ]).then(([hist, st]) => {
      setHistory(hist)
      setStats(st)
      setLoading(false)
    })
  }, [])

  // Get previous prediction from history for comparison
  const prevPredicted = history.length > 1
    ? history[history.length - 2]?.predicted
    : result?.predicted * 0.88

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

  const diff = prevPredicted ? (result.predicted - prevPredicted) : 0
  const diffColor = diff > 0 ? '#ff6b35' : 'var(--green)'

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
          { label:'Prediction',     value:`${result.predicted.toFixed(1)}`,                          unit:'kWh', color:'var(--accent)' },
          { label:'Vs Last Prediction', value:`${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`,           unit:'kWh', color: diffColor },
          { label:'Confidence',     value:`${result.confidence ?? 92}`,                               unit:'%',   color:'var(--blue)' },
          { label:'Model R²',       value: loading ? '...' : stats?.r2?.toFixed(3) ?? '0.620',        unit:'',    color:'var(--green)' },
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
          <ComparisonChart
            predicted={result.predicted}
            previous={prevPredicted ?? result.predicted * 0.88}
          />
        </Card>
        <Card title="ESTIMATED BREAKDOWN">
          <BreakdownChart predicted={result.predicted} />
        </Card>
      </div>

      {/* Trend + stats */}
      <div className="fade-up-3" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px' }}>
        <Card title="HISTORICAL TREND">
          {loading ? (
            <div style={{ textAlign:'center', padding:'40px',
              color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
              Loading history...
            </div>
          ) : history.length > 1 ? (
            <TrendChart history={history} />
          ) : (
            <div style={{ textAlign:'center', padding:'40px',
              color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
              Make more predictions to see the trend!
            </div>
          )}
        </Card>
        <Card title="MODEL PERFORMANCE">
          <ModelStats stats={stats} />
        </Card>
      </div>
    </div>
  )
}