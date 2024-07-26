from rest_framework import serializers
from .models import Wallet, Transaction ,Bet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'user', 'balance']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'sender', 'receiver', 'amount', 'created_at']



class BetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bet
        fields = ['id', 'sender', 'eventId', 'home', 'away', 'amount', 'bet', 'result']
