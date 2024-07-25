from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MatchAnalysisSerializer
from .utils.InsightLLM import main
from . import models
from datetime import datetime, timedelta
import smtplib, ssl
from django.http import JsonResponse
import json
def create_mail(request):
    data = json.loads(request.body)
    m = models.Mail(
        email = data["email"],
        time = data["time"],
        msg = data["msg"]
    )
    m.save()
    print(models.Mail.objects.all())
    return JsonResponse({"status":200})
def send_mails(request):
    port = 465  # For SSL
    password = "xilh cwup pqlf gyaq"
    mail = "betscom72@gmail.com"
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(mail, password)
        mails = models.Mail.objects.all()
        for m in mails:
            d = datetime.fromisoformat(m.time)
            d = d + timedelta(hours=2)
            d = d.replace(tzinfo=None)
            now = datetime.now()
            if d < now:
                server.sendmail(mail, m.email,m.msg)
                m.delete()
        return JsonResponse({"status":200})

# Create your views here.
class MatchAnalysisView(APIView):
    # Método para manejar las solicitudes POST
    def post(self, request):
        # Instancia el serializer con los datos recibidos en la solicitud
        serializer = MatchAnalysisSerializer(data=request.data)
        
        # Verifica si los datos son válidos según las reglas del serializer
        if serializer.is_valid():
            # Extrae los datos validados del serializer
            team1_id = serializer.validated_data['team1_id']
            team2_id = serializer.validated_data['team2_id']
            league = serializer.validated_data['league']

            try:
                # Llama a la función principal con los datos validados
                analysis, winner_id = main(team1_id, team2_id, league)
                # Si la llamada es exitosa, retorna una respuesta con los resultados y un estado HTTP 200 OK
                return Response({
                    'analysis': analysis,
                    'winner_id': winner_id
                }, status=status.HTTP_200_OK)
            except Exception as e:
                # Si ocurre una excepción, retorna una respuesta con el mensaje de error y un estado HTTP 500 Internal Server Error
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Si los datos no son válidos, retorna una respuesta con los errores de validación y un estado HTTP 400 Bad Request
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
