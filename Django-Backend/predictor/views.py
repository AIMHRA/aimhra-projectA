from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ml_utils import predict_risk

@api_view(['POST'])
def predict(request):
    result = predict_risk(request.data)
    return Response({'risk': result})