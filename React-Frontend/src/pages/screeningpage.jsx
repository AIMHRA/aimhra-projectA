import { useState } from 'react'
import PatientForm from '../components/PatientForm'
import RiskResult  from '../components/RiskResult'
import { predictRisk, mockPredict } from '../utils/api'

const USE_MOCK = true  // ← change to false when backend is ready

export default function ScreeningPage() {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = USE_MOCK
        ? mockPredict(formData)
        : await predictRisk(formData)
      setResult(data)
    } catch (err) {
      setError('Could not connect to server. Check backend is running.')
    } finally {
      setLoading(false)
    }
  }

  function handleSendAlert() {
    // Wire to SMS API later — for now just confirm
    alert('Emergency alert sent to nearest CEONC facility.')
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Maternal Health Risk Screening</h1>
        <p style={styles.subtitle}>
          Enter patient vital signs below to assess maternal health risk
        </p>
      </div>

      {/* Form card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Patient Vital Signs</h2>
        <PatientForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>⚠ {error}</div>
      )}

      {/* Result */}
      <RiskResult result={result} onSendAlert={handleSendAlert} />

      {/* Mock indicator */}
      {USE_MOCK && (
        <p style={styles.mockNote}>
          🔧 Running in mock mode — connect backend to get real predictions
        </p>
      )}
    </div>
  )
}

const styles = {
  page:      { maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem', fontFamily: 'system-ui, sans-serif' },
  header:    { marginBottom: 20 },
  title:     { fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0 },
  subtitle:  { fontSize: 14, color: '#666', marginTop: 4 },
  card:      { background: 'white', border: '0.5px solid #e5e5e5', borderRadius: 12,
                padding: '1.25rem', marginBottom: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 16 },
  errorBox:  { background: '#FCEBEB', color: '#A32D2D', padding: '0.75rem 1rem',
                borderRadius: 8, fontSize: 13, marginTop: 12 },
  mockNote:  { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 16 },
}