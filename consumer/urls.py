from django.urls import path
from . import views

urlpatterns = [
    path('', views.consumer_homme, name='consumer_homme'),
    path('salon/', views.salon, name='salon'),
]