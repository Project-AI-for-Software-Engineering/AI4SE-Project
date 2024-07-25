from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer
from django.contrib.auth.models import User

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer

    @action(detail=True, methods=['post'])
    def recharge(self, request, pk=None):
        wallet = self.get_object()
        amount = request.data.get('amount', 0)
        wallet.balance += float(amount)
        wallet.save()
        return Response({'status': 'balance updated'})

    @action(detail=False, methods=['post'])
    def transfer(self, request):
        sender_id = request.data.get('sender')
        receiver_id = request.data.get('receiver')
        amount = request.data.get('amount', 0)

        sender_wallet = Wallet.objects.get(id=sender_id)
        receiver_wallet = Wallet.objects.get(id=receiver_id)

        if sender_wallet.balance >= float(amount):
            sender_wallet.balance -= float(amount)
            receiver_wallet.balance += float(amount)
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
