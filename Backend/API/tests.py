from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

# python manage.py test API

class MatchAnalysisTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()  # Configura el cliente de pruebas de la API
        self.url = reverse('match-analysis')  # Obtiene la URL del endpoint utilizando su nombre
        self.valid_payload = {
            "team1_id": 33,
            "team2_id": 34,
            "league": 39
        }
        self.invalid_payload_1 = {
            "team1_id": "invalid",  # Datos inválidos: team1_id no es un entero
            "team2_id": 34,
            "league": 39
        }
        self.invalid_payload_2 = {
            "team1_id": 3,
            "team2_id": "invalid",  # Datos inválidos: team2_id no es un entero
            "league": 39
        }
        self.invalid_payload_3 = {
            "team1_id": 33,
            "team2_id": 34,
            "league": "invalid"  # Datos inválidos: league no es un entero
        }
        self.incomplete_payload = {
            "team1_id": 33,
            "league": 39  # Datos incompletos: falta team2_id
        }

    # Prueba el buen funcionamiento de la vista MatchAnalysisView
    def test_valid_match_analysis(self):
        response = self.client.post(self.url, data=self.valid_payload, format='json')
        # Verifica que el estado de la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verifica que la respuesta contenga las claves 'analysis' y 'winner_id'
        self.assertIn('analysis', response.data)
        self.assertIn('winner_id', response.data)

    # Prueba de caso de uso incorrecto
    def test_invalid_match_analysis_1(self):
        response = self.client.post(self.url, data=self.invalid_payload_1, format='json')
        # Verifica que el estado de la respuesta sea 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    # Prueba de caso de uso incorrecto
    def test_invalid_match_analysis_2(self):
        response = self.client.post(self.url, data=self.invalid_payload_2, format='json')
        # Verifica que el estado de la respuesta sea 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    # Prueba de caso de uso incorrecto
    def test_invalid_match_analysis_3(self):
        response = self.client.post(self.url, data=self.invalid_payload_3, format='json')
        # Verifica que el estado de la respuesta sea 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    # Prueba de caso de uso incorrecto
    def test_missing_fields_match_analysis(self):
        response = self.client.post(self.url, data=self.incomplete_payload, format='json')
        # Verifica que el estado de la respuesta sea 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
