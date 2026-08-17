import { useState } from 'react'
const FIELDS = [
  { key: 'age',          label: 'Age',                    unit: 'years', min: 10,  max: 65,  step: 1,   placeholder: 'e.g. 25'   },
  { key: 'systolic_bp',  label: 'Systolic Blood Pressure', unit: 'mmHg',  min: 70,  max: 200, step: 1,   placeholder: 'e.g. 120'  },
  { key: 'diastolic_bp', label: 'Diastolic Blood Pressure',unit: 'mmHg',  min: 40,  max: 150, step: 1,   placeholder: 'e.g. 80'   },
  { key: 'bs',           label: 'Blood Sugar (Fasting)',   unit: 'mg/dl', min: 3.5, max: 9,   step: 0.1, placeholder: 'e.g. 5.8'  },
  { key: 'body_temp',    label: 'Body Temperature',        unit: '°F',    min: 95,  max: 105, step: 0.1, placeholder: 'e.g. 98.6' },
  { key: 'heart_rate',   label: 'Heart Rate',              unit: 'bpm',   min: 40,  max: 160, step: 1,   placeholder: 'e.g. 80'   },
]

export default function PatientForm({ onSubmit, loading }) {
  const empty = FIELDS.reduce((a, f) => ({ ...a, [f.key]: '' }), {})
  const [form,   setForm]   = useState(empty)
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    FIELDS.forEach(f => {
      const v = parseFloat(form[f.key])
      if (form[f.key] === '')       errs[f.key] = 'Required'
      else if (isNaN(v))            errs[f.key] = 'Must be a number'
      else if (v < f.min)           errs[f.key] = `Min value is ${f.min}`
      else if (v > f.max)           errs[f.key] = `Max value is ${f.max}`
    })
    return errs
  }

  function onChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  function reset() {
    setForm(empty)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {FIELDS.map(f => (
          <div key={f.key}>
            <label style={styles.label}>
              {f.label}
              <span style={styles.unit}> ({f.unit})</span>
            </label>
            <input
              type="number"
              name={f.key}
              value={form[f.key]}
              onChange={onChange}
              min={f.min} max={f.max} step={f.step}
              placeholder={f.placeholder}
              style={{
                ...styles.input,
                borderColor: errors[f.key] ? '#E24B4A' : '#ddd'
              }}
            />
            {errors[f.key] && (
              <p style={styles.error}>⚠ {errors[f.key]}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button type="submit" disabled={loading} style={styles.btnPrimary}>
          {loading ? '⏳ Assessing...' : '🔍 Assess Risk'}
        </button>
        <button type="button" onClick={reset} style={styles.btnSecondary}>
          Clear
        </button>
      </div>
    </form>
  )
}

const styles = {
  label:       { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#333' },
  unit:        { fontWeight: 400, color: '#888', fontSize: 12 },
  input:       { width: '100%', padding: '8px 10px', border: '1px solid #ddd',
                  borderRadius: 6, fontSize: 14, outline: 'none' },
  error:       { fontSize: 11, color: '#E24B4A', marginTop: 3 },
  btnPrimary:  { flex: 1, padding: '10px 0', background: '#1D9E75', color: 'white',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  cursor: 'pointer' },
  btnSecondary:{ padding: '10px 18px', background: 'white', color: '#555',
                  border: '1px solid #ddd', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
}