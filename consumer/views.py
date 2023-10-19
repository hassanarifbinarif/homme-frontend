from django.shortcuts import render

# Create your views here.


def consumer_homme(request):
    context = {}
    context['active_page'] = 'homme'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/consumer-homme.html', context)


def salon(request):
    context = {}
    context['active_page'] = 'salon'
    context['sidebar'] = 'consumer'
    return render(request, 'consumer/salon.html', context)