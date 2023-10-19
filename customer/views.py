from django.shortcuts import render

# Create your views here.

def homme(request):
    context = {}
    context['active_page'] = 'homme'
    context['sidebar'] = 'customer'
    return render(request, 'customer/homme.html', context)


def orders(request):
    context = {}
    context['active_page'] = 'orders'
    context['sidebar'] = 'customer'
    return render(request, 'customer/orders.html', context)


def specific_order(request):
    context = {}
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