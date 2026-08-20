import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

// Send patient vitals → get risk prediction back
// Field names match exactly what Django ml_utils.py expects
export async function predictRisk(formData) {
  const payload = {
    age:            parseFloat(formData.age),
    systolic_bp:    parseFloat(formData.systolic_bp),
    diastolic_bp:   parseFloat(formData.diastolic_bp),
    body_temp:      parseFloat(formData.body_temp),
    heart_rate:     parseFloat(formData.heart_rate),
    bmi:            parseFloat(formData.bmi),
    hba1c:          parseFloat(formData.hba1c),
    fasting_glucose:parseFloat(formData.fasting_glucose),
  }
  // Note the trailing slash — Django requires it
  const { data } = await API.post('/api/predict/', payload)
  return data
}

// Mock response — used while backend is being set up
export function mockPredict(formData) {
  const sbp = parseFloat(formData.systolic_bp)
  const age = parseFloat(formData.age)

  let riskKey = 'low'
  if (sbp > 140 || age > 40) riskKey = 'mid'
  if (sbp > 155)              riskKey = 'high'

  const LABELS = { low: 'Low Risk', mid: 'Medium Risk', high: 'High Risk' }
  const RECOS  = {
    low:  'Continue routine antenatal care. Schedule next visit in 4 weeks.',
    mid:  'Increased monitoring required. Follow-up within 2 weeks. Monitor BP and blood sugar daily.',
    high: 'IMMEDIATE REFERRAL REQUIRED. Contact nearest CEONC facility now. Do not delay.'
  }

  return {
    risk:             riskKey + ' risk',
    risk_level:       riskKey,
    risk_label:       LABELS[riskKey],
    confidence:       riskKey === 'high' ? 91.2 : riskKey === 'mid' ? 74.5 : 88.3,
    probabilities: {
      low:  riskKey==='low'  ? 88.3 : riskKey==='mid' ? 18.2 : 3.1,
      mid:  riskKey==='mid'  ? 74.5 : riskKey==='low' ? 9.4  : 6.2,
      high: riskKey==='high' ? 91.2 : riskKey==='mid' ? 7.3  : 0.6,
    },
    shap_contributions: {
      SystolicBP:  35.2,
      DiastolicBP: 28.1,
      HbA1c:       15.4,
      FastingGlucose: 12.1,
      BMI:          8.3,
      Age:          5.9,
      HeartRate:    3.1,
      BodyTemp:     0.9,
    },
    recommendation: RECOS[riskKey]
  }
}