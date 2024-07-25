from django.test import TestCase
from rest_framework.test import APIClient
from datetime import datetime, timedelta
from rest_framework import status
from django.urls import reverse
from . import models
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

class MailTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.create_mail_url = reverse('create-mail')
        self.send_mails_url = reverse('send-mails')

    def test_create_mail(self):
        data = {
            "email": "test@example.com",
            "time": datetime.now().isoformat(),
            "msg": "Test message"
        }
        response = self.client.post(
            self.create_mail_url,
            data=data,
            format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(models.Mail.objects.count(), 1)
        mail = models.Mail.objects.first()
        self.assertEqual(mail.email, data['email'])
        self.assertEqual(mail.msg, data['msg'])

    def test_create_mail_with_invalid_data(self):
        data = {
            "email": "test@example.com",
            "time": datetime.now().isoformat()
            # "msg" is missing
        }
        response = self.client.post(
            self.create_mail_url,
            data=data,
            format='json'
        )
        self.assertNotEqual(response.status_code, 200)
        self.assertEqual(models.Mail.objects.count(), 0)

    def test_send_mails(self):
        mail = models.Mail(
            email='test@example.com',
            time=(datetime.now() - timedelta(hours=3)).isoformat(),
            msg='Test message'
        )
        mail.save()

        response = self.client.post(self.send_mails_url)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(models.Mail.objects.count(), 0)

    def test_send_mails_when_no_mails_exist(self):
        response = self.client.post(self.send_mails_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(models.Mail.objects.count(), 0)

    def test_send_mail_with_future_time(self):
        mail = models.Mail(
            email='test@example.com',
            time=(datetime.now() + timedelta(hours=3)).isoformat(),
            msg='Test message'
        )
        mail.save()

        response = self.client.post(self.send_mails_url)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(models.Mail.objects.count(), 1)
        mail.refresh_from_db()
        self.assertEqual(mail.email, 'test@example.com')
        self.assertEqual(mail.msg, 'Test message')

    def test_create_multiple_mails(self):
        data1 = {
            "email": "test1@example.com",
            "time": datetime.now().isoformat(),
            "msg": "Test message 1"
        }
        data2 = {
            "email": "test2@example.com",
            "time": (datetime.now() + timedelta(hours=1)).isoformat(),
            "msg": "Test message 2"
        }
        response1 = self.client.post(
            self.create_mail_url,
            data=data1,
            format='json'
        )
        response2 = self.client.post(
            self.create_mail_url,
            data=data2,
            format='json'
        )
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(models.Mail.objects.count(), 2)
        mail1 = models.Mail.objects.get(email=data1['email'])
        mail2 = models.Mail.objects.get(email=data2['email'])
        self.assertEqual(mail1.msg, data1['msg'])
        self.assertEqual(mail2.msg, data2['msg'])