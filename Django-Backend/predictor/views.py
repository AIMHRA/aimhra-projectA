from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ml_utils import predict_risk

@api_view(['POST'])
def predict(request):
    required = ['age', 'body_temp', 'heart_rate', 'systolic_bp',
                'diastolic_bp', 'bmi', 'hba1c', 'fasting_glucose']

    missing = [f for f in required if f not in request.data]
    if missing:
        return Response(
            {'error': f'Missing fields: {missing}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        result = predict_risk(request.data)
        return Response(result)        # ← directly return result, not {'risk': result}
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)