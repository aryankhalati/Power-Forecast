export default function HistoryTable({ history }) {
  if (!history?.length) return (
    <div style={{ textAlign:'center', padding:'48px', color:'var(--text3)',
      fontFamily:'var(--font-mono)', fontSize:'13px' }}>
      No predictions yet. Run a forecast to see history.
    </div>
  )

  const cols = ['Date', 'Prev (kWh)', 'Predicted (kWh)', 'Temp °C', 'Season', 'Δ Change']

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} style={{
                padding: '10px 14px', textAlign:'left',
                fontSize:'10px', fontWeight:600, letterSpacing:'0.1em',
                color:'var(--text3)', textTransform:'uppercase',
                borderBottom:'1px solid var(--border)',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.map((row, i) => {
            const diff = row.predicted - row.prev_consumption
            const up   = diff > 0
            return (
              <tr key={i} style={{
                borderBottom:'1px solid var(--border)',
                transition:'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding:'12px 14px', color:'var(--text2)', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
                  {new Date(row.timestamp).toLocaleDateString()}
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)' }}>
                  {row.prev_consumption}
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)', color:'var(--accent)', fontWeight:600 }}>
                  {row.predicted?.toFixed(1)}
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)', color:'var(--text2)' }}>
                  {row.temperature}°
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{
                    padding:'2px 8px', borderRadius:'20px', fontSize:'11px',
                    background:'var(--bg3)', color:'var(--text2)',
                    border:'1px solid var(--border)',
                  }}>
                    {row.season}
                  </span>
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)', fontSize:'12px',
                  color: up ? '#ff6b35' : 'var(--green)', fontWeight:600 }}>
                  {up ? '+' : ''}{diff.toFixed(1)} kWh
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}