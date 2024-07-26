from django.db import models
from django.contrib.auth.models import User
from cryptography.fernet import Fernet

# Load encryption key

def load_key():
    with open('secret.key', 'rb') as key_file:
        return key_file.read()


key = load_key()
fernet = Fernet(key)

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)  


class Transaction(models.Model):
    sender = models.ForeignKey(Wallet, related_name='sent_transactions', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Wallet, related_name='received_transactions', on_delete=models.CASCADE)
    _description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
