import json
from django.shortcuts import render
from homme.decorators import admin_signin_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from homme.helpers import requestAPI
from django.conf import settings



def consumer_homme(request):
    context = {}
    context['active_page'] = 'homme'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-homme.html', context)


def salon(request):
    context = {}
    context['active_page'] = 'salons'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/salon.html', context)


def specific_salon(request):
    context = {}
    context['active_page'] = 'salons'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/specific-salon.html', context)


def activity(request):
    context = {}
    context['active_page'] = 'activity'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-activity.html', context)


def commissions(request):
    context = {}
    context['active_page'] = 'commissions'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/commission.html', context)


def product_sales(request):
    context = {}
    context['active_page'] = 'product_sales'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/product-sales.html', context)


def specific_sale(request):
    context = {}
    context['active_page'] = 'product_sales'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/specific-sale.html', context)


def inventory(request):
    context = {}
    context['active_page'] = 'inventory'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/inventory.html', context)


def consumer_marketing(request):
    context = {}
    context['active_page'] = 'marketing'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-marketing.html', context)


# @admin_signin_required
def consumer_products(request):
    context = {}
    # context['admin_name'] = api_response['fullname']
    # context['admin_image'] = api_response['user']['profile_picture']
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
        status, response = requestAPI('GET', f'{request_data}', headers, {})
        text_template = loader.get_template('ajax/consumer-product-table.html')
        html = text_template.render({'products':response})
        context['product_data'] = html
        context['msg'] = 'Products retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


def specific_product(request, pk):
    context = {}
    admin_access_token = request.COOKIES.get('admin_access')
    headers = {"Authorization": f'Bearer {admin_access_token}'}
    status, response = requestAPI('GET', f'{settings.API_URL}/admin/products/{pk}', headers, {})
    context['product'] = response['data']
    # context['admin_name'] = api_response['fullname']
    # context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'products'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-specific-product.html', context)


def events(request):
    context = {}
    context['active_page'] = 'events'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/events.html', context)


def slider(request):
    context = {}
    context['active_page'] = 'sliders'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/slider.html', context)