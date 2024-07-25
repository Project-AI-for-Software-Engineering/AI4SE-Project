from django.db import models

# Create your models here.
class Mail(models.Model):
    email = models.EmailField()
    time = models.CharField(max_length=255)
    msg = models.CharField(max_length= 255)