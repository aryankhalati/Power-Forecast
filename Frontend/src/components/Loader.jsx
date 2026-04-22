export default function Loader({ text = 'Running model...' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', padding:'40px' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid var(--bg3)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text2)', letterSpacing:'0.08em' }}>
        {text}
      </span>
    </div>
  )
}