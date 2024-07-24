from django.urls import path, include
from rest_framework import routers
from API.views import MatchAnalysisView

routers = routers.DefaultRouter()
urlpatterns = [
    # Define la ruta para el análisis de partidos
    path('match-analysis/', MatchAnalysisView.as_view(), name='match-analysis'),
]