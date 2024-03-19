import json
from django.shortcuts import render, redirect
from homme.decorators import admin_signin_required
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from homme.helpers import requestAPI
from django.conf import settings




def signin(request):
    context = {}
    return render(request, 'authentication/signin.html', context)


def forgot_password(request):
    context = {}
    return render(request, 'authentication/forgot-password.html', context)


def verify_code(request):
    context = {}
    return render(request, 'authentication/verify-code.html', context)


def reset_password(request):
    context = {}
    return render(request, 'authentication/reset-password.html', context)


@admin_signin_required
def homme(request):
    context = {}
    context['active_page'] = 'homme'
    context['sidebar'] = 'customer'
    return render(request, 'customer/homme.html', context)


@csrf_exempt
@admin_signin_required
def homme_orders_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/homme-order-table.html')
        html = text_template.render({'orders':response})
        context['orders_data'] = html
        context['paginationData'] = response['pagination']
        context['msg'] = 'Orders retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def sliders(request):
    context = {}
    context['active_page'] = 'sliders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/sliders.html', context)


@csrf_exempt
@admin_signin_required
def get_sliders_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/slider-table.html')
        html = text_template.render({'sliders':response})
        context['sliders_data'] = html
        context['msg'] = 'Sliders retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def orders(request, pk=None):
    context = {}
    context['user'] = pk
    context['active_page'] = 'orders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/orders.html', context)


@csrf_exempt
@admin_signin_required
def get_order_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/customer-order-table.html')
        html = text_template.render({'orders':response})
        context['order_data'] = html
        context['total_orders'] = response['stats']['total_orders']
        context['order_items'] = response['stats']['order_items']
        context['completed_orders'] = response['stats']['completed_orders']
        context['total_orders'] = response['stats']['total_orders']
        context['open_orders'] = response['stats']['open_orders']
        context['completion_time'] = response['stats']['completion_time']
        context['msg'] = 'Orders retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_order(request, pk):
    context = {}
    admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
    headers = {"Authorization": f'Bearer {admin_access_token}'}
    status, response = requestAPI('GET', f'{settings.API_URL}/admin/orders/{pk}', headers, {})
    context['order'] = response['data']
    context['active_page'] = 'orders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-order.html', context)


@admin_signin_required
def customers(request):
    context = {}
    context['active_page'] = 'customers'
    context['sidebar'] = 'customer'
    return render(request, 'customer/customers.html', context)


@csrf_exempt
@admin_signin_required
def get_customer_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/customer-table.html')
        html = text_template.render({'customers':response})
        context['customer_data'] = html
        context['total_customers'] = response['pagination']['count']
        context['msg'] = 'Customers retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_customer(request, pk):
    context = {}
    try:
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}/admin/user-profiles/{pk}', headers, {})
        status_last_order, response_last_order = requestAPI('GET', f'{settings.API_URL}/admin/orders?page=1&perPage=1&ordering=-created_at&user={response["data"]["user"]["id"]}', headers, {})
        context['last_order'] = response_last_order['data']
        # print(response["data"]["user"]["id"])
        context['customer'] = response['data']
    except Exception as e:
        print(e)
    context['active_page'] = 'customers'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-customer.html', context)


@admin_signin_required
def products(request):
    context = {}
    context['active_page'] = 'products'
    context['sidebar'] = 'customer'
    return render(request, 'customer/products.html', context)


@csrf_exempt
@admin_signin_required
def get_product_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/customer-product-table.html')
        html = text_template.render({'products':response})
        context['product_data'] = html
        context['msg'] = 'Products retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def specific_product(request, pk):
    context = {}
    admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
    headers = {"Authorization": f'Bearer {admin_access_token}'}
    status, response = requestAPI('GET', f'{settings.API_URL}/admin/products/{pk}?insight_days=30', headers, {})
    context['product'] = response['data']
    context['active_page'] = 'products'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-product.html', context)


@csrf_exempt
@admin_signin_required
def get_product_images(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        text_template = loader.get_template('ajax/product-image-gallery.html')
        html = text_template.render({'product':request_data})
        context['product_images'] = html
        context['msg'] = 'Product images retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def activity(request):
    context = {}
    context['active_page'] = 'activity'
    context['sidebar'] = 'customer'
    return render(request, 'customer/activity.html', context)


@csrf_exempt
@admin_signin_required
def get_activities_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/customer-activities-table.html')
        html = text_template.render({'activities':response})
        context['activity_data'] = html
        context['msg'] = 'Activities list retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def referrals(request):
    context = {}
    context['active_page'] = 'referrals'
    context['sidebar'] = 'customer'
    return render(request, 'customer/referrals.html', context)


@csrf_exempt
@admin_signin_required
def get_referrals_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/referrals-table.html')
        html = text_template.render({'referrals':response})
        context['total_referrals'] = response['stats']['total_referrals'] or None
        context['rewards_by_referrals'] = response['stats']['rewards_by_referrals'] or None
        context['rewards_by_sales'] = response['stats']['rewards_by_sales'] or None
        context['total_rewards'] = response['stats']['total_rewards'] or None
        context['referrals_data'] = html
        context['msg'] = 'Referrals retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def marketing(request):
    context = {}
    context['active_page'] = 'marketing'
    context['sidebar'] = 'customer'
    return render(request, 'customer/marketing.html', context)


@csrf_exempt
@admin_signin_required
def get_marketing_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/marketing-table.html')
        html = text_template.render({'marketing':response})
        context['marketing_data'] = html
        context['msg'] = 'Marketing list retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def source(request):
    context = {}
    context['active_page'] = 'source'
    context['sidebar'] = 'customer'
    return render(request, 'customer/source.html', context)


@csrf_exempt
@admin_signin_required
def get_source_list(request):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}{request_data}', headers, {})
        text_template = loader.get_template('ajax/source-table.html')
        html = text_template.render({'source':response})
        context['source_data'] = html
        context['msg'] = 'Source list retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


@admin_signin_required
def profile(request):
    context = {}
    sidebarType = 'customer'
    previous_url = request.META.get('HTTP_REFERER')
    if previous_url and 'consumer' in previous_url:
        sidebarType = 'consumer'
    context['sidebar'] = sidebarType
    return render(request, 'customer/profile.html', context)


@admin_signin_required
def get_packing_slip(request, pk):
    context = {}
    context['success'] = False
    context['msg'] = None
    try:
        admin_access_token = request.COOKIES.get('admin_access', request.temp_cookie)
        headers = {"Authorization": f'Bearer {admin_access_token}'}
        status, response = requestAPI('GET', f'{settings.API_URL}/admin/orders/{pk}', headers, {})
        text_template = loader.get_template('email_templates/packing-slip-new.html')
        html = text_template.render({'order':response['data']})

        context['packing_data'] = html
        context['msg'] = 'Packing slip retrieved'
        context['success'] = True
    except Exception as e:
        print(e)
    return JsonResponse(context)


def user_register_redirector(request):
    # Get all query parameters from the request
    query_params = request.GET.urlencode()

    # Append the query parameters to the redirect URL
    redirect_url_with_params = f'{settings.REDIRECT_URL_STRING}?{query_params}'

    return redirect(redirect_url_with_params)