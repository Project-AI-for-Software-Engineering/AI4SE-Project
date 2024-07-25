from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Wallet, Transaction

@api_view(['POST'])
def send_money(request):
    from_wallet_id = request.data.get('from_wallet')
    to_wallet_id = request.data.get('to_wallet')
    amount = float(request.data.get('amount', 0))

    try:
        from_wallet = Wallet.objects.get(id=from_wallet_id, user=request.user)
        to_wallet = Wallet.objects.get(id=to_wallet_id)

        if from_wallet.balance >= amount:
            from_wallet.balance -= amount
            from_wallet.save()

            to_wallet.balance += amount
            to_wallet.save()

            Transaction.objects.create(wallet=from_wallet, amount=-amount, transaction_type='debit')
            Transaction.objects.create(wallet=to_wallet, amount=amount, transaction_type='credit')

            return Response({'message': 'Money sent successfully!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Insufficient funds.'}, status=status.HTTP_400_BAD_REQUEST)

    except Wallet.DoesNotExist:
        return Response({'error': 'Wallet not found.'}, status=status.HTTP_404_NOT_FOUND)
