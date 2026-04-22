export default function ResultCard({ result }) {
  if (!result) return null

  const { predicted, confidence, inputs } = result

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border2)',
      borderRadius: 'var(--radius-lg)',
      padding: '28px',
      display: 'flex', flexDirection: 'column', gap: '20px',
      boxShadow: 'var(--glow)',
      animation: 'fadeUp 0.5s ease both',
    }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.12em',
          color:'var(--text2)', textTransform:'uppercase' }}>
          Predicted Energy Consumption
        </span>
        <span style={{
          padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600,
          background:'rgba(240,192,64,0.12)', color:'var(--accent)',
          border:'1px solid rgba(240,192,64,0.3)',
        }}>
          ⚡ Live Result
        </span>
      </div>

      {/* Big number */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:'8px' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: 1,
          color: 'var(--accent)',
          letterSpacing: '0.02em',
        }}>
          {predicted.toFixed(2)}
        </span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'14px',
          color:'var(--text2)', marginBottom:'6px' }}>
          kWh
        </span>
      </div>

      {/* Input summary */}
      {inputs && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
          {[
            { label:'Temperature',  value:`${inputs.temperature}°C` },
            { label:'Humidity',     value:`${inputs.humidity}%` },
            { label:'Square Ft',    value:`${inputs.square_footage} sq ft` },
            { label:'Occupancy',    value:`${inputs.occupancy} people` },
            { label:'HVAC',         value: inputs.hvac_usage },
            { label:'Lighting',     value: inputs.lighting_usage },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background:'var(--bg3)', borderRadius:'10px', padding:'10px 12px',
              border:'1px solid var(--border)',
            }}>
              <div style={{ fontSize:'10px', color:'var(--text3)', letterSpacing:'0.08em',
                textTransform:'uppercase', marginBottom:'3px' }}>{label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'13px',
                color:'var(--text)', fontWeight:500 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Confidence */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
          <span style={{ fontSize:'11px', color:'var(--text3)', letterSpacing:'0.06em',
            textTransform:'uppercase' }}>
            Model Confidence
          </span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--blue)' }}>
            {confidence ?? 92}%
          </span>
        </div>
        <div style={{ height:'4px', background:'var(--bg3)', borderRadius:'2px', overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${confidence ?? 92}%`,
            background:'linear-gradient(90deg, var(--blue), var(--accent))',
            borderRadius:'2px', transition:'width 1s ease',
          }} />
        </div>
      </div>

    </div>
  )
}