from django.urls import path
from . import views

urlpatterns = [
    path('', views.consumer_homme, name='consumer_homme'),
    path('salon/', views.salon, name='salon'),
    path('get-salon-list/', views.get_salon_list, name='get_salon_list'),
    path('specific-salon/<int:pk>/', views.specific_salon, name='specific_salon'),
    path('inventory/', views.inventory, name='inventory'),
    path('get-inventory-list/', views.get_inventory_list, name='get_inventory_list'),
    path('get-purchase-order/<int:pk>/', views.get_purchase_order, name='get_purchase_order'),
    path("finance/", views.activity, name="consumer_activity"),    
    path('commissions/', views.commissions, name='commissions'),
    path('get-commissions-list/', views.get_commissions_list, name='get_commissions_list'),
    path('product-sales/', views.product_sales, name='product_sales'),
    path('get-sales-list/', views.get_sales_list, name='get_sales_list'),
    path('specific-sale/<int:pk>/', views.specific_sale, name='specific_sale'),
    path('marketing/', views.consumer_marketing, name='consumer_marketing'),
    path('get-salon-marketing-list/', views.get_salon_marketing_list, name='get_salon_marketing_list'),
    path('products/', views.consumer_products, name='consumer_products'),
    path('get-product-list/', views.get_product_list, name='get_product_list'),
    path('specific-product/<int:pk>/', views.specific_product, name='consumer_specific_product'),
    path('events/', views.events, name="events"),
    path('get-events-list/', views.get_events_list, name='get_events_list'),
    path('slider/', views.consumer_slider, name='consumer_slider')
]