from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MatchAnalysisSerializer
from .utils.InsightLLM import main

# Create your views here.
class MatchAnalysisView(APIView):
    def post(self, request):
        serializer = MatchAnalysisSerializer(data=request.data)
        if serializer.is_valid():
            team1_id = serializer.validated_data['team1_id']
            team2_id = serializer.validated_data['team2_id']
            league = serializer.validated_data['league']

            try:
                analysis, winner_id = main(team1_id, team2_id, league)
                return Response({
                    'analysis': analysis,
                    'winner_id': winner_id
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)