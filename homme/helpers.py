import requests
import jwt
from django.conf import settings as settings
from django.shortcuts import redirect
from datetime import datetime


# Helper methods for project

def requestAPI(method:str, url:str, headers:dict, data:dict):
    status = 400
    try:
        response = requests.request(method, url, headers=headers, data=data, verify=False)
        return response.status_code, response.json()
    except Exception as e:
        return status, str(e)
    

def get_access_token_from_api(request):
    refresh_response = requests.post(f'{settings.API_URL}/auth/refresh', json={"refresh": request.COOKIES.get('admin_refresh')})
    if refresh_response.status_code == 200:
        access_token = refresh_response.json().get('access')
        return access_token
    else:
        return redirect('/signin/')
    

def get_expiry_time_from_access_token(token):
    decoded = jwt.decode(jwt=token, algorithms=["HS256"], options={"verify_signature": False})
    date = datetime.utcfromtimestamp(decoded['exp'])
    return date


def get_admin_detail(request, token=None):
    admin_access_token = request.COOKIES.get('admin_access', token)
    headers = {"Authorization": f"Bearer {admin_access_token}"}
    admin_response = requests.get(f'{settings.API_URL}/me', headers=headers)
    admin_name = admin_response.json().get('fullname')
    admin_image = admin_response.json()['user']['profile_picture']
    return admin_name, admin_image