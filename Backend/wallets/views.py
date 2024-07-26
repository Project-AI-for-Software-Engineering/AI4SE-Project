from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from decimal import Decimal
from django.http import JsonResponse
from .models import Wallet, Transaction, Bet
from .serializers import WalletSerializer, TransactionSerializer
from cryptography.fernet import Fernet
import requests
from datetime import datetime, timedelta
import smtplib, ssl
from django.http import JsonResponse
import json
key = Fernet.generate_key()
from django.conf import settings
from django.core.mail import send_mail
 
# Instance the Fernet class with the key
 
message = "hello geeks"
fernet = Fernet(key)


encMessage = fernet.encrypt(message.encode())
print("type ", type(encMessage)) 
print("original string: ", message)
print("encrypted string: ", encMessage)
 

 
def send_mails(email):
    
    subject = 'Bet Result | Bet App'
    message = f'Hi , thank you for registering in geeksforgeeks.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = "jd.florezr1@uniandes.edu.co"
    send_mail( subject, message, email_from, recipient_list )


# decrypt the encrypted string with the 
# Fernet instance of the key,
# that was used for encrypting the string
# encoded byte string is returned by decrypt method,
# so decode it to string with decode methods
decMessage = fernet.decrypt(encMessage).decode()
 
print("decrypted string: ", decMessage)

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer




    @action(detail=True, methods=['post'])
    def recharge(self, request, pk=None):
        wallet = self.get_object()
        amount = request.data.get('amount', 0)
        wallet.balance += Decimal(amount)
        wallet.save()

        return Response({'status': 'balance updated'})
    
    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        wallet = self.get_object()
        return Response({'balance': wallet.balance})
   

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):   
        transactions = Transaction.objects.filter()
        bets= Bet.objects.filter()

              
        transactions_list = [
            {
                'id': transaction.id,
                'amount': str(transaction.amount), 
                '_description': fernet.decrypt(fernet.encrypt(str(transaction.amount).encode())).decode()
            }
            for transaction in transactions
        ]
        bets_list = [
            {
                'eventId': bet.eventId,
                'home': str(bet.home),
                'away': str(bet.away), 
                'amount': str(bet.amount), 
                'bet': str(bet.bet),
                'result':"TBD",  
               
            }
            for bet in bets
        ]


        for i in bets_list: 
            print(i)
            print(i.keys())
            print(i['amount'])
            # Define the variables
            sport = 'football'  # or any other sport
            date = '2024-07-26'  # replace with the desired date

            # Construct the URL
            url = f"https://v3.{sport}.api-sports.io/fixtures?date={date}"

            # Define the headers
            headers = {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "f14603dd89062225cd14d52269234f84",
            }

            # Make the GET request
            response = requests.get(url, headers=headers)
            result= True # Si gané o perdi mi partido
            if (result):
                sender_wallet = Wallet.objects.get(id=1)
                receiver_wallet = Wallet.objects.get(id=10)
                if sender_wallet.balance >= Decimal(i['amount']):
                    sender_wallet.balance -= Decimal(i['amount'])
                    receiver_wallet.balance += Decimal(i['amount'])
                    sender_wallet.save()
                    receiver_wallet.save()
                    Transaction.objects.create(
                        sender=receiver_wallet,
                        receiver=sender_wallet,
                        amount=float(i['amount']), 
                        _description= str(fernet.encrypt(str(i['amount']).encode()))
                    )
            if result:
                i['result']=["You Won " + str(2*Decimal(i['amount']))]
                send_mails("jd.florezr1@uniandes.edu.co")
            # Check if the request was successful
            if response.status_code == 200:
                data = response.json()
                # Process the data here
                print("Result of the match")
                print(data['response'])
            else:
                print(f"Failed to fetch data: {response.status_code}")


        return JsonResponse({'transactions': transactions_list,'bets': bets_list })


    @action(detail=False, methods=['post'])
    def transfer(self, request):
        sender_id = request.data.get('sender')
        receiver_id = request.data.get('receiver')
        amount = request.data.get('amount', 0)

        sender_wallet = Wallet.objects.get(id=sender_id)
        receiver_wallet = Wallet.objects.get(id=receiver_id)

        if sender_wallet.balance >= Decimal(amount):
            sender_wallet.balance -= Decimal(amount)
            receiver_wallet.balance += Decimal(amount)
            sender_wallet.save()
            receiver_wallet.save()


            Transaction.objects.create(
                sender=sender_wallet,
                receiver=receiver_wallet,
                amount=float(amount), 
                _description= str(fernet.encrypt(str(amount).encode()))
            )
            Bet.objects.create(
            sender =sender_wallet,
            eventId = request.data.get('eventid'),
            home = request.data.get('home'),
            away=  request.data.get('away'),
            amount = float(amount),
            bet = request.data.get('bet'),
            result= ""
            )

            return Response({'status': 'transfer completed'})
        else:
            return Response({'status': 'insufficient funds'}, status=400)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
