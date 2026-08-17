const RISK_CONFIG = {
  low:  { bg: '#E1F5EE', border: '#A8DCC4', color: '#085041', emoji: '🟢', label: 'Low Risk'   },
  mid:  { bg: '#FAEEDA', border: '#F0C98A', color: '#633806', emoji: '🟡', label: 'Medium Risk' },
  high: { bg: '#FCEBEB', border: '#F0A0A0', color: '#A32D2D', emoji: '🔴', label: 'HIGH RISK'   },
}

export default function RiskResult({ result, onSendAlert }) {
  if (!result) return null
  const cfg  = RISK_CONFIG[result.risk_level]
  const top3 = Object.entries(result.shap_contributions || {})
                 .sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <div style={{
      background: cfg.bg, border: `1.5px solid ${cfg.border}`,
      borderRadius: 12, padding: '1.25rem', marginTop: 20
    }}>

      {/* Risk level + confidence */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: cfg.color, margin: 0 }}>
            {cfg.emoji} {result.risk_label}
          </h2>
          <p style={{ fontSize: 13, color: cfg.color, opacity: 0.8, marginTop: 2 }}>
            Confidence: {result.confidence}%
          </p>
        </div>

        {/* Probability pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.entries(result.probabilities || {}).map(([k, v]) => (
            <div key={k} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 12,
              background: 'rgba(0,0,0,0.08)', color: cfg.color, fontWeight: 500
            }}>
              {k}: {v}%
            </div>
          ))}
        </div>
      </div>

      {/* SHAP contributing factors */}
      {top3.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: cfg.color, marginBottom: 8 }}>
            Key contributing factors:
          </p>
          {top3.map(([name, val]) => (
            <div key={name} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                             fontSize: 12, color: cfg.color, marginBottom: 3 }}>
                <span>{name}</span>
                <span style={{ fontWeight: 500 }}>{val}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>
                <div style={{
                  height: '100%', width: `${val}%`,
                  background: cfg.color, borderRadius: 4,
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div style={{
        background: 'rgba(0,0,0,0.06)', borderRadius: 8,
        padding: '0.75rem', marginBottom: result.risk_level === 'high' ? 12 : 0
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: cfg.color, marginBottom: 4 }}>
          Clinical Recommendation:
        </p>
        <p style={{ fontSize: 13, color: cfg.color, lineHeight: 1.5 }}>
          {result.recommendation}
        </p>
      </div>

      {/* Emergency SMS button — only for high risk */}
      {result.risk_level === 'high' && (
        <button onClick={onSendAlert} style={{
          width: '100%', marginTop: 12, padding: '10px',
          background: '#A32D2D', color: 'white', border: 'none',
          borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', letterSpacing: 0.3
        }}>
          🚨 Send Emergency SMS Alert to CEONC Facility
        </button>
      )}
    </div>
  )
}