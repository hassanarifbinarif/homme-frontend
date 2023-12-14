import json
from django.shortcuts import render
from homme.decorators import admin_signin_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from homme.helpers import requestAPI
from django.conf import settings



@admin_signin_required
def consumer_homme(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'homme'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-homme.html', context)


@admin_signin_required
def salon(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'salons'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/salon.html', context)


@csrf_exempt
def get_salon_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/salon-table.html')
        html = text_template.render({'salons':response})
        context['salon_data'] = html
        context['msg'] = 'Salons retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_salon(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'salons'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/specific-salon.html', context)


@admin_signin_required
def activity(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'activity'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-activity.html', context)


@admin_signin_required
def commissions(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'commissions'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/commission.html', context)


@admin_signin_required
def product_sales(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'product_sales'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/product-sales.html', context)


@admin_signin_required
def specific_sale(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'product_sales'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/specific-sale.html', context)


@admin_signin_required
def inventory(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'inventory'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/inventory.html', context)


@csrf_exempt
def get_inventory_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/inventory-table.html')
        html = text_template.render({'inventory':response})
        context['inventory_data'] = html
        context['msg'] = 'Inventory retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


def get_purchase_order(request, pk):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}/admin/inventory/{pk}', headers, {})
        text_template = loader.get_template('email_templates/purchase-order-email.html')
        html = text_template.render({'order':response['data']})

        context['purchase_data'] = html
        context['msg'] = 'Purchase order retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def consumer_marketing(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'marketing'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-marketing.html', context)


@admin_signin_required
def consumer_products(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'products'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-products.html', context)


@csrf_exempt
def get_product_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/consumer-product-table.html')
        html = text_template.render({'products':response})
        context['product_data'] = html
        context['msg'] = 'Products retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_product(request, api_response, pk):
    context = {}
    admin_access_token = request.COOKIES.get('admin_access')
    headers = {"Authorization": f'Bearer {admin_access_token}'}
    status, response = requestAPI('GET', f'{settings.API_URL}/admin/products/{pk}', headers, {})
    context['product'] = response['data']
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'products'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-specific-product.html', context)


@admin_signin_required
def events(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'events'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/events.html', context)


@csrf_exempt
def get_events_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/events-table.html')
        html = text_template.render({'events':response})
        context['events_data'] = html
        context['msg'] = 'Events retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def consumer_slider(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'sliders'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-slider.html', context)