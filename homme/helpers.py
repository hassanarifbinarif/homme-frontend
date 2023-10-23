import requests
from django.conf import settings as django_settings


# Helper methods for project

def requestAPI(method:str, url:str, headers:dict, data:dict):
    status = 400
    try:
        response = requests.request(method, url, headers=headers, data=data, verify=False)
        return response.status_code, response.json()
    except Exception as e:
        return status, str(e)