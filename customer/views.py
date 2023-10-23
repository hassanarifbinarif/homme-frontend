from django.shortcuts import render
from homme.decorators import admin_signin_required

# Create your views here.



def signin(request):
    context = {}
    return render(request, 'authentication/signin.html', context)


def homme(request):
    context = {}
    # context['admin_name'] = api_response['fullname']
    # context['admin_image'] = api_response['user']['profile_picture']
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


@admin_signin_required
def specific_order(request, api_response):
    context = {}
    context['admin_name'] = api_response['fullname']
    context['admin_image'] = api_response['user']['profile_picture']
    context['active_page'] = 'orders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-order.html', context)


def referrals(request):
    context = {}
    context['active_page'] = 'referrals'
    return render(request, 'customer/referrals.html', context)


def customers(request):
    context = {}
    context['active_page'] = 'customers'
    context['sidebar'] = 'customer'
    return render(request, 'customer/customers.html', context)


def specific_customer(request):
    context = {}
    context['active_page'] = 'customers'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-customer.html', context)


def products(request):
    context = {}
    context['active_page'] = 'products'
    context['sidebar'] = 'customer'
    return render(request, 'customer/products.html', context)


def specific_product(request):
    context = {}
    context['active_page'] = 'products'
    context['sidebar'] = 'customer'
    return render(request, 'customer/specific-product.html', context)


def activity(request):
    context = {}
    context['active_page'] = 'activity'
    context['sidebar'] = 'customer'
    return render(request, 'customer/activity.html', context)


def marketing(request):
    context = {}
    context['active_page'] = 'marketing'
    context['sidebar'] = 'customer'
    return render(request, 'customer/marketing.html', context)