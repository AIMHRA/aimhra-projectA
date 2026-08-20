import joblib
import pandas as pd
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
model = joblib.load(os.path.join(MODEL_DIR, 'random_forest_model.pk1'))

# Numeric prediction → display values
RISK_KEY   = {0: 'low',       1: 'mid',       2: 'high'}
RISK_LABEL = {0: 'Low Risk',  1: 'Mid Risk',  2: 'High Risk'}
RISK_STR   = {0: 'low risk',  1: 'mid risk',  2: 'high risk'}

RECOMMENDATIONS = {
    'low':  'Continue routine antenatal care. Schedule next visit in 4 weeks. Maintain healthy diet and light physical activity.',
    'mid':  'Increased monitoring required. Follow-up within 2 weeks. Monitor BP and blood sugar daily. Contact health center if symptoms worsen.',
    'high': 'IMMEDIATE REFERRAL REQUIRED. Contact nearest CEONC facility now. Do not delay — transport patient to equipped health facility immediately.'
}

DISPLAY_NAMES = [
    'Age', 'BodyTemp', 'HeartRate',
    'SystolicBP', 'DiastolicBP',
    'BMI', 'HbA1c', 'FastingGlucose'
]

def predict_risk(data):
    sample = pd.DataFrame([{
        'Age':                                float(data['age']),
        'Body Temperature(F) ':               float(data['body_temp']),
        'Heart rate(bpm)':                    float(data['heart_rate']),
        'Systolic Blood Pressure(mm Hg)':     float(data['systolic_bp']),
        'Diastolic Blood Pressure(mm Hg)':    float(data['diastolic_bp']),
        'BMI(kg/m 2)':                        float(data['bmi']),
        'Blood Glucose(HbA1c)':               float(data['hba1c']),
        'Blood Glucose(Fasting hour-mg/dl)':  float(data['fasting_glucose']),
    }])

    pred_idx = int(model.predict(sample)[0])
    risk_key = RISK_KEY[pred_idx]

    # Probabilities
    try:
        proba = model.predict_proba(sample)[0]
        probabilities = {
            'low':  round(float(proba[0]) * 100, 1),
            'mid':  round(float(proba[1]) * 100, 1),
            'high': round(float(proba[2]) * 100, 1),
        }
        confidence = round(float(max(proba)) * 100, 1)
    except Exception:
        probabilities = {'low': 0.0, 'mid': 0.0, 'high': 0.0}
        confidence    = 0.0

    # Feature importance as SHAP proxy
    try:
        importances = model.feature_importances_
        total       = sum(importances) or 1
        shap_contributions = {
            name: round(float(imp) / total * 100, 1)
            for name, imp in zip(DISPLAY_NAMES, importances)
        }
        shap_contributions = dict(
            sorted(shap_contributions.items(),
                   key=lambda x: x[1], reverse=True)
        )
    except Exception:
        shap_contributions = {}

    return {
        'risk':               RISK_STR[pred_idx],
        'risk_level':         risk_key,
        'risk_label':         RISK_LABEL[pred_idx],
        'confidence':         confidence,
        'probabilities':      probabilities,
        'shap_contributions': shap_contributions,
        'recommendation':     RECOMMENDATIONS[risk_key],
    }