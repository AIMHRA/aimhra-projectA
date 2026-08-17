import joblib
import pandas as pd
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
model = joblib.load(os.path.join(MODEL_DIR, 'random_forest_model.pk1'))

LABEL_MAP = {0: 'low risk', 1: 'mid risk', 2: 'high risk'}

def predict_risk(data):
    sample = pd.DataFrame([{
        'Age': data['age'],
        'Body Temperature(F) ': data['body_temp'],
        'Heart rate(bpm)': data['heart_rate'],
        'Systolic Blood Pressure(mm Hg)': data['systolic_bp'],
        'Diastolic Blood Pressure(mm Hg)': data['diastolic_bp'],
        'BMI(kg/m 2)': data['bmi'],
        'Blood Glucose(HbA1c)': data['hba1c'],
        'Blood Glucose(Fasting hour-mg/dl)': data['fasting_glucose'],
    }])
    prediction = model.predict(sample)[0]
    return LABEL_MAP[prediction]