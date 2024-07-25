from django.urls import path
from . import views

urlpatterns = [
    path('api/send_money/', views.send_money, name='send_money'),

]
