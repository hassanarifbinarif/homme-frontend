from django.urls import path
from . import views

urlpatterns = [
    path('signin/', views.signin, name='signin'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('verify-code/', views.verify_code, name='verify_code'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('', views.homme, name='homme'),
    path('homme-orders-list/', views.homme_orders_list, name='homme_orders_list'),
    path('sliders/', views.sliders, name='sliders'),
    path('get-sliders-list/', views.get_sliders_list, name='get_sliders_list'),
    path('orders/', views.orders, name='orders'),
    path('orders/<int:pk>/', views.orders, name='distinct_order'),
    path('get-order-list/', views.get_order_list, name='get_order_list'),
    path('specific-order/<int:pk>/', views.specific_order, name='specific_order'),
    path('referrals/', views.referrals, name='referrals'),
    path('get-referrals-list/', views.get_referrals_list, name='get_referrals_list'),
    path('customers/', views.customers, name='customers'),
    path('get-customer-list/', views.get_customer_list, name='get_customer_list'),
    path('specific-customer/<int:pk>/', views.specific_customer, name='specific_customer'),
    path('products/', views.products, name='products'),
    path('get-product-list/', views.get_product_list, name='get_product_list'),
    path('specific-product/<int:pk>/', views.specific_product, name='specific_product'),
    path('get-product-images/', views.get_product_images, name='get_product_images'),
    path('activity/', views.activity, name='activity'),
    path('get-activities-list/', views.get_activities_list, name='get_activities_list'),
    path('marketing/', views.marketing, name='marketing'),
    path('get-marketing-list/', views.get_marketing_list, name='get_marketing_list'),
    path('source/', views.source, name='source'),
    path('get-source-list/', views.get_source_list, name='get_source_list'),
    path('profile/', views.profile, name='profile'),
    path('get-packing-slip/<int:pk>/', views.get_packing_slip, name='get_packing_slip')
]