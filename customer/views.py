from django.shortcuts import render

# Create your views here.

def homme(request):
    context = {}
    context['active_page'] = 'homme'
    return render(request, 'homme.html', context)


def orders(request):
    context = {}
    context['active_page'] = 'orders'
    return render(request, 'orders.html', context)


def specific_order(request):
    context = {}
    context['active_page'] = 'orders'
    return render(request, 'specific-order.html', context)


def referrals(request):
    context = {}
    context['active_page'] = 'referrals'
    return render(request, 'referrals.html', context)


def customers(request):
    context = {}
    context['active_page'] = 'customers'
    return render(request, 'customers.html', context)


def specific_customer(request):
    context = {}
    context['active_page'] = 'customers'
    return render(request, 'specific-customer.html', context)


def products(request):
    context = {}
    context['active_page'] = 'products'
    return render(request, 'products.html', context)


def specific_product(request):
    context = {}
    context['active_page'] = 'products'
    return render(request, 'specific-product.html', context)


def activity(request):
    context = {}
    context['active_page'] = 'activity'
    return render(request, 'activity.html', context)


def marketing(request):
    context = {}
    context['active_page'] = 'marketing'
    return render(request, 'marketing.html', context)