from django.urls import path
from . import views

urlpatterns = [
    path('', views.homme, name='homme'),
    path('orders/', views.orders, name='orders'),
    path('specific-order/', views.specific_order, name='specific_order'),
    path('referrals/', views.referrals, name='referrals'),
    path('customers/', views.customers, name='customers'),
    path('specific-customer/', views.specific_customer, name='specific_customer'),
    path('products/', views.products, name='products'),
    path('specific-product/', views.specific_product, name='specific_product'),
    path('activity/', views.activity, name='activity'),
    path('marketing/', views.marketing, name='marketing'),
]