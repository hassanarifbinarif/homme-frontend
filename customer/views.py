import json
from django.shortcuts import render
from homme.decorators import admin_signin_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from homme.helpers import requestAPI
from django.conf import settings

# Create your views here.



def signin(request):
    context = {}
    return render(request, 'authentication/signin.html', context)


@admin_signin_required
def homme(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'homme'
    context['sidebar'] = 'customer'
    return render(request, 'customer/homme.html', context)


@admin_signin_required
def orders(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'orders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/orders.html', context)


@csrf_exempt
def get_order_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        context['total_orders'] = len(response['data'])
        context['ordered_items'] = 0
        for order in response['data']:
            context['ordered_items'] += len(order['products'])
        text_template = loader.get_template('ajax/customer-order-table.html')
        html = text_template.render({'orders':response})
        context['order_data'] = html
        context['msg'] = 'Orders retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_order(request, api_response, pk):
    context = {}
    print(pk)
    admin_access_token = request.COOKIES.get('admin_access')
    headers = {"Authorization": f'Bearer {admin_access_token}'}
    status, response = requestAPI('GET', f'{settings.API_URL}/admin/orders/{pk}', headers, {})
    context['order'] = response['data']
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'orders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-order.html', context)


@admin_signin_required
def referrals(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'referrals'
    return render(request, 'customer/referrals.html', context)


@admin_signin_required
def customers(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'customers'
    context['sidebar'] = 'customer'
    return render(request, 'customer/customers.html', context)


@admin_signin_required
def specific_customer(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'customers'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-customer.html', context)


@admin_signin_required
def products(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'products'
    context['sidebar'] = 'customer'
    return render(request, 'customer/products.html', context)


@csrf_exempt
def get_product_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access')
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        text_template = loader.get_template('ajax/customer-product-table.html')
        html = text_template.render({'products':response})
        context['product_data'] = html
        context['msg'] = 'Orders retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_product(request, api_response, pk):
    print(pk)
    context = {}
    admin_access_token = request.COOKIES.get('admin_access')
    headers = {"Authorization": f'Bearer {admin_access_token}'}
    status, response = requestAPI('GET', f'{settings.API_URL}/admin/products/{pk}', headers, {})
    context['product'] = response['data']
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'products'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-product.html', context)


@admin_signin_required
def activity(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'activity'
    context['sidebar'] = 'customer'
    return render(request, 'customer/activity.html', context)


@admin_signin_required
def marketing(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'marketing'
    context['sidebar'] = 'customer'
    return render(request, 'customer/marketing.html', context)