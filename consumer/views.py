from django.shortcuts import render



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


def consumer_marketing(request):
    context = {}
    context['marketing'] = 'marketing'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-marketing.html', context)