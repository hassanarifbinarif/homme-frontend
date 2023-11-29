from django.conf import settings

def api_base_url(request):
    # Using the API_BASE_URL defined in our Django settings
    return {'API_BASE_URL': settings.API_URL}
