export default function HistoryTable({ history }) {
  if (!history?.length) return (
    <div style={{ textAlign:'center', padding:'48px', color:'var(--text3)',
      fontFamily:'var(--font-mono)', fontSize:'13px' }}>
      No predictions yet. Run a forecast to see history.
    </div>
  )

  const cols = ['Date', 'Predicted (kWh)', 'Temp °C', 'Humidity', 'HVAC', 'Occupancy']

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
          {history.map((row, i) => (
            <tr key={i} style={{
              borderBottom:'1px solid var(--border)',
              transition:'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding:'12px 14px', color:'var(--text2)',
                fontFamily:'var(--font-mono)', fontSize:'12px' }}>
                {new Date(row.timestamp).toLocaleDateString()}
              </td>
              <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)',
                color:'var(--accent)', fontWeight:600 }}>
                {row.predicted?.toFixed(1)}
              </td>
              <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)',
                color:'var(--text2)' }}>
                {row.temperature}°
              </td>
              <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)',
                color:'var(--text2)' }}>
                {row.humidity}%
              </td>
              <td style={{ padding:'12px 14px' }}>
                <span style={{
                  padding:'2px 8px', borderRadius:'20px', fontSize:'11px',
                  background: row.hvac_usage === 'On'
                    ? 'rgba(57,217,138,0.12)' : 'rgba(136,136,170,0.12)',
                  color: row.hvac_usage === 'On' ? 'var(--green)' : 'var(--text3)',
                  border: `1px solid ${row.hvac_usage === 'On'
                    ? 'rgba(57,217,138,0.3)' : 'rgba(136,136,170,0.2)'}`,
                }}>
                  {row.hvac_usage}
                </span>
              </td>
              <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)',
                fontSize:'12px', color:'var(--text)', fontWeight:600 }}>
                {row.occupancy} people
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}