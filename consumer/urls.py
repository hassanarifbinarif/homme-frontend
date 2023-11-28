from django.urls import path
from . import views

urlpatterns = [
    path('', views.consumer_homme, name='consumer_homme'),
    path('salon/', views.salon, name='salon'),
    path('specific-salon/', views.specific_salon, name='specific_salon'),
    path('inventory/', views.inventory, name='inventory'),
    path('activity/', views.activity, name='consumer_activity'),
    path('marketing/', views.consumer_marketing, name='consumer_marketing'),
    path('products/', views.consumer_products, name='consumer_products'),
    path('get-product-list/', views.get_product_list, name='get_product_list'),
    path('specific-product/<int:pk>/', views.specific_product, name='specific_product'),
    path('events/', views.events, name="events"),
]