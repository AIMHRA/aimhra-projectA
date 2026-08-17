import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

// Send patient vitals → get risk prediction back
export async function predictRisk(formData) {
  const payload = {
    age:          parseFloat(formData.age),
    systolic_bp:  parseFloat(formData.systolic_bp),
    diastolic_bp: parseFloat(formData.diastolic_bp),
    bs:           parseFloat(formData.bs),
    body_temp:    parseFloat(formData.body_temp),
    heart_rate:   parseFloat(formData.heart_rate),
  }
  const { data } = await API.post('/api/predict', payload)
  return data
}

// Mock response — used while backend is not ready yet
export function mockPredict(formData) {
  const age = parseFloat(formData.age)
  const sbp = parseFloat(formData.systolic_bp)

  // Simple logic so different inputs give different results
  let risk = 'low'
  if (sbp > 140 || age > 40) risk = 'mid'
  if (sbp > 155) risk = 'high'

  return {
    risk_level: risk,
    risk_label: { low:'Low Risk', mid:'Medium Risk', high:'High Risk' }[risk],
    confidence: risk === 'high' ? 91.2 : risk === 'mid' ? 74.5 : 88.3,
    probabilities: {
      low:  risk==='low'  ? 88.3 : risk==='mid' ? 18.2 : 3.1,
      mid:  risk==='mid'  ? 74.5 : risk==='low' ? 9.4  : 6.2,
      high: risk==='high' ? 91.2 : risk==='mid' ? 7.3  : 0.6,
    },
    shap_contributions: {
      SystolicBP:  35.2,
      DiastolicBP: 28.1,
      BS:          18.4,
      Age:         10.2,
      HeartRate:    5.1,
      BodyTemp:     3.0
    },
    recommendation: {
      low:  'Continue routine antenatal care. Schedule next visit in 4 weeks.',
      mid:  'Increased monitoring required. Follow-up within 2 weeks. Monitor BP and blood sugar daily.',
      high: 'IMMEDIATE REFERRAL REQUIRED. Contact nearest CEONC facility now. Do not delay.'
    }[risk]
  }
}