import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const Field = ({ label, hint, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
    <label style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.1em',
      color:'var(--text2)', textTransform:'uppercase' }}>
      {label}
      {hint && <span style={{ fontWeight:400, color:'var(--text3)', marginLeft:'6px',
        textTransform:'none', letterSpacing:0 }}>{hint}</span>}
    </label>
    {children}
  </div>
)

const inputStyle = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  padding: '10px 14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  width: '100%',
}

export default function InputForm({ onSubmit, loading }) {
  const now = new Date()
  const [form, setForm] = useState({
    temperature:      '',
    humidity:         '',
    square_footage:   '',
    occupancy:        '',
    hvac_usage:       'On',
    lighting_usage:   'On',
    renewable_energy: '',
    day_of_week:      DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1],
    holiday:          'No',
    hour:             now.getHours(),
    day:              now.getDate(),
    month:            now.getMonth() + 1,
  })
  const [focused, setFocused] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const dynInput = (key) => ({
    ...inputStyle,
    borderColor: focused === key ? 'rgba(240,192,64,0.5)' : 'var(--border)',
    boxShadow:   focused === key ? '0 0 0 3px rgba(240,192,64,0.08)' : 'none',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      temperature:      parseFloat(form.temperature),
      humidity:         parseFloat(form.humidity),
      square_footage:   parseFloat(form.square_footage),
      occupancy:        parseInt(form.occupancy),
      hvac_usage:       form.hvac_usage,
      lighting_usage:   form.lighting_usage,
      renewable_energy: parseFloat(form.renewable_energy),
      day_of_week:      form.day_of_week,
      holiday:          form.holiday,
      hour:             parseInt(form.hour),
      day:              parseInt(form.day),
      month:            parseInt(form.month),
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Row 1 — Temperature & Humidity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <Field label="Temperature" hint="(°C)">
          <input type="number" placeholder="e.g. 28" value={form.temperature}
            onChange={set('temperature')} required step="0.1"
            style={dynInput('temperature')}
            onFocus={() => setFocused('temperature')}
            onBlur={() => setFocused(null)} />
        </Field>
        <Field label="Humidity" hint="(%)">
          <input type="number" placeholder="e.g. 55" value={form.humidity}
            onChange={set('humidity')} required min="0" max="100" step="0.1"
            style={dynInput('humidity')}
            onFocus={() => setFocused('humidity')}
            onBlur={() => setFocused(null)} />
        </Field>
      </div>

      {/* Row 2 — Square Footage & Occupancy */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <Field label="Square Footage" hint="(sq ft)">
          <input type="number" placeholder="e.g. 1500" value={form.square_footage}
            onChange={set('square_footage')} required min="0" step="0.1"
            style={dynInput('square_footage')}
            onFocus={() => setFocused('square_footage')}
            onBlur={() => setFocused(null)} />
        </Field>
        <Field label="Occupancy" hint="(people)">
          <input type="number" placeholder="e.g. 4" value={form.occupancy}
            onChange={set('occupancy')} required min="0" max="50"
            style={dynInput('occupancy')}
            onFocus={() => setFocused('occupancy')}
            onBlur={() => setFocused(null)} />
        </Field>
      </div>

      {/* Row 3 — Renewable Energy & Day */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <Field label="Renewable Energy" hint="(kWh)">
          <input type="number" placeholder="e.g. 5.2" value={form.renewable_energy}
            onChange={set('renewable_energy')} required min="0" step="0.1"
            style={dynInput('renewable_energy')}
            onFocus={() => setFocused('renewable_energy')}
            onBlur={() => setFocused(null)} />
        </Field>
        <Field label="Day of Week">
          <select value={form.day_of_week} onChange={set('day_of_week')}
            style={dynInput('day_of_week')}
            onFocus={() => setFocused('day_of_week')}
            onBlur={() => setFocused(null)}>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
      </div>

      {/* HVAC Toggle */}
      <Field label="HVAC Usage">
        <div style={{ display:'flex', gap:'10px' }}>
          {['On', 'Off'].map(v => (
            <button key={v} type="button"
              onClick={() => setForm(f => ({ ...f, hvac_usage: v }))}
              style={{
                flex:1, padding:'10px', borderRadius:'10px', cursor:'pointer',
                fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500,
                border: form.hvac_usage === v
                  ? '1px solid rgba(240,192,64,0.5)' : '1px solid var(--border)',
                background: form.hvac_usage === v
                  ? 'rgba(240,192,64,0.1)' : 'var(--bg3)',
                color: form.hvac_usage === v ? 'var(--accent)' : 'var(--text2)',
                transition:'all 0.2s',
              }}>
              {v}
            </button>
          ))}
        </div>
      </Field>

      {/* Lighting Toggle */}
      <Field label="Lighting Usage">
        <div style={{ display:'flex', gap:'10px' }}>
          {['On', 'Off'].map(v => (
            <button key={v} type="button"
              onClick={() => setForm(f => ({ ...f, lighting_usage: v }))}
              style={{
                flex:1, padding:'10px', borderRadius:'10px', cursor:'pointer',
                fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500,
                border: form.lighting_usage === v
                  ? '1px solid rgba(240,192,64,0.5)' : '1px solid var(--border)',
                background: form.lighting_usage === v
                  ? 'rgba(240,192,64,0.1)' : 'var(--bg3)',
                color: form.lighting_usage === v ? 'var(--accent)' : 'var(--text2)',
                transition:'all 0.2s',
              }}>
              {v}
            </button>
          ))}
        </div>
      </Field>

      {/* Holiday Toggle */}
      <Field label="Holiday">
        <div style={{ display:'flex', gap:'10px' }}>
          {['No', 'Yes'].map(v => (
            <button key={v} type="button"
              onClick={() => setForm(f => ({ ...f, holiday: v }))}
              style={{
                flex:1, padding:'10px', borderRadius:'10px', cursor:'pointer',
                fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500,
                border: form.holiday === v
                  ? '1px solid rgba(240,192,64,0.5)' : '1px solid var(--border)',
                background: form.holiday === v
                  ? 'rgba(240,192,64,0.1)' : 'var(--bg3)',
                color: form.holiday === v ? 'var(--accent)' : 'var(--text2)',
                transition:'all 0.2s',
              }}>
              {v}
            </button>
          ))}
        </div>
      </Field>

      {/* Submit */}
      <button type="submit" disabled={loading} style={{
        marginTop:'4px', padding:'14px', borderRadius:'12px', border:'none',
        background: loading ? 'var(--bg3)' : 'var(--accent)',
        color: loading ? 'var(--text3)' : '#0a0a0f',
        fontFamily:'var(--font-display)', fontSize:'1.1rem',
        letterSpacing:'0.08em',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition:'all 0.2s',
        animation: !loading ? 'pulse-glow 2.5s infinite' : 'none',
      }}>
        {loading ? 'COMPUTING...' : '⚡ PREDICT CONSUMPTION'}
      </button>
    </form>
  )
}