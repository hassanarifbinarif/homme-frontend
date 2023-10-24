from django.urls import path
from . import views

urlpatterns = [
    path('signin/', views.signin, name='signin'),
    path('', views.homme, name='homme'),
    path('orders/', views.orders, name='orders'),
    path('get-order-list/', views.get_order_list, name='get_order_list'),
    path('specific-order/<int:pk>/', views.specific_order, name='specific_order'),
    path('referrals/', views.referrals, name='referrals'),
    path('customers/', views.customers, name='customers'),
    path('specific-customer/', views.specific_customer, name='specific_customer'),
    path('products/', views.products, name='products'),
    path('get-product-list/', views.get_product_list, name='get_product_list'),
    path('specific-product/<int:pk>/', views.specific_product, name='specific_product'),
    path('activity/', views.activity, name='activity'),
    path('marketing/', views.marketing, name='marketing'),
]