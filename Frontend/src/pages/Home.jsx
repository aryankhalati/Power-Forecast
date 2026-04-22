import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputForm from '../components/InputForm'
import ResultCard from '../components/ResultCard'
import Loader from '../components/Loader'
import { predictConsumption } from '../api/forecastApi'

// Mock result when backend isn't connected yet
const MOCK_RESULT = () => ({
  predicted:   72.5 + Math.random() * 20,
  confidence:  88 + Math.floor(Math.random() * 10),
})

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)
  const navigate              = useNavigate()

  const handleSubmit = async (formData) => {
    setLoading(true); setError(null)
    try {
      const res = await predictConsumption(formData)
      setResult({ ...res, inputs: formData })
    } catch {
      const mock = MOCK_RESULT()
      setResult({ ...mock, inputs: formData })
      setError('⚠ Backend not connected — showing mock prediction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'40px 24px' }}>

      {/* Hero */}
      <div className="fade-up" style={{ marginBottom:'48px' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.15em',
          color:'var(--accent)', textTransform:'uppercase', marginBottom:'10px' }}>
          ⚡ ML-Powered Energy Intelligence
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight:0.95, letterSpacing:'0.02em', marginBottom:'14px' }}>
          PREDICT YOUR<br/>
          <span style={{ color:'var(--accent)' }}>POWER</span> USAGE
        </h1>
        <p style={{ color:'var(--text2)', maxWidth:'460px', lineHeight:1.7 }}>
          Enter your building data and environmental context.
          Our Linear Regression model forecasts energy consumption instantly.
        </p>
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', alignItems:'start' }}>

        {/* Left: Form */}
        <div className="fade-up-1" style={{
          background:'var(--bg2)', borderRadius:'var(--radius-lg)',
          border:'1px solid var(--border)', padding:'28px',
          boxShadow:'var(--shadow)',
        }}>
          <div style={{ marginBottom:'24px' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', letterSpacing:'0.05em' }}>
              INPUT PARAMETERS
            </h2>
            <p style={{ color:'var(--text2)', fontSize:'13px', marginTop:'4px' }}>
              Fill in all fields for the best prediction accuracy
            </p>
          </div>
          <InputForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Right: Result */}
        <div className="fade-up-2" style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {loading && (
            <div style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow)',
            }}>
              <Loader text="Running Linear Regression..." />
            </div>
          )}

          {!loading && result && <ResultCard result={result} />}

          {!loading && !result && (
            <div style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'var(--radius-lg)', padding:'48px 28px',
              textAlign:'center', boxShadow:'var(--shadow)',
            }}>
              <div style={{ fontSize:'48px', marginBottom:'16px', opacity:0.3 }}>⚡</div>
              <p style={{ color:'var(--text3)', fontFamily:'var(--font-mono)', fontSize:'13px' }}>
                Submit the form to see your prediction
              </p>
            </div>
          )}

          {error && (
            <div style={{
              padding:'12px 16px', borderRadius:'10px', fontSize:'12px',
              background:'rgba(255,107,53,0.08)', border:'1px solid rgba(255,107,53,0.2)',
              color:'#ff6b35', fontFamily:'var(--font-mono)',
            }}>
              {error}
            </div>
          )}

          {result && !loading && (
            <button
              onClick={() => navigate('/dashboard', { state: { result } })}
              style={{
                padding:'12px', borderRadius:'10px', cursor:'pointer',
                background:'transparent', border:'1px solid var(--border2)',
                color:'var(--text2)', fontFamily:'var(--font-body)', fontSize:'13px',
                fontWeight:500, transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor='var(--accent)'; e.target.style.color='var(--accent)' }}
              onMouseLeave={e => { e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--text2)' }}
            >
              View Full Dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}