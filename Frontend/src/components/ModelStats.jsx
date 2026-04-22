export default function ModelStats({ stats }) {
  const items = stats ? [
    { label: 'R² Score',   value: stats.r2?.toFixed(3)  ?? '—', color:'var(--green)',  hint:'Accuracy' },
    { label: 'MAE',        value: stats.mae?.toFixed(2) ?? '—', color:'var(--blue)',   hint:'Mean Abs Error' },
    { label: 'RMSE',       value: stats.rmse?.toFixed(2)?? '—', color:'var(--accent)', hint:'Root MSE' },
    { label: 'Train Size', value: stats.train_size ?? '—',      color:'var(--text)',   hint:'Samples' },
  ] : Array(4).fill({ label:'—', value:'—', color:'var(--text3)', hint:'' })

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px' }}>
      {items.map(({ label, value, color, hint }) => (
        <div key={label} style={{
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '14px',
        }}>
          <div style={{ fontSize:'10px', color:'var(--text3)', letterSpacing:'0.08em',
            textTransform:'uppercase', marginBottom:'6px' }}>
            {label}
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'18px', color, fontWeight:600 }}>
            {value}
          </div>
          <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'2px' }}>{hint}</div>
        </div>
      ))}
    </div>
  )
}