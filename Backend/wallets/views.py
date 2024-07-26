from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from decimal import Decimal
from django.http import JsonResponse
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer
from cryptography.fernet import Fernet



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
    def history(self, request, pk=None):   
        
        transactions = Transaction.objects.filter()
        transactions_list = [
            {
                'id': transaction.id,
                'amount': str(transaction.amount)
            }
            for transaction in transactions
        ]
        return JsonResponse({'transactions': transactions_list})


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
                amount=float(amount)
            )

            return Response({'status': 'transfer completed'})
        else:
            return Response({'status': 'insufficient funds'}, status=400)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
