from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

# Create your tests here.
class MatchAnalysisTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('match-analysis')
        self.valid_payload = {
            "team1_id": 33,
            "team2_id": 34,
            "league": 39
        }
        self.invalid_payload_1 = {
            "team1_id": "invalid",
            "team2_id": 34,
            "league": 39
        }
        self.invalid_payload_2 = {
            "team1_id": 3,
            "team2_id": "invalid",
            "league": 39
        }
        self.invalid_payload_3 = {
            "team1_id": 33,
            "team2_id": 34,
            "league": "invalid"
        }
        self.incomplete_payload = {
            "team1_id": 33,
            "league": 39
        }

    def test_valid_match_analysis(self):
        response = self.client.post(self.url, data=self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('analysis', response.data)
        self.assertIn('winner_id', response.data)

    def test_invalid_match_analysis_1(self):
        response = self.client.post(self.url, data=self.invalid_payload_1, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_invalid_match_analysis_2(self):
        response = self.client.post(self.url, data=self.invalid_payload_2, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_invalid_match_analysis_3(self):
        response = self.client.post(self.url, data=self.invalid_payload_3, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_missing_fields_match_analysis(self):
        response = self.client.post(self.url, data=self.incomplete_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)