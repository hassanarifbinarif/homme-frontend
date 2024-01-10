from django.shortcuts import redirect
from customer.helpers import check_admin_login
from homme.helpers import get_access_token_from_api, get_expiry_time_from_access_token, get_admin_detail


# def admin_signin_required(function):
#     def wrap(request, *args, **kwargs):
#         status, response = check_admin_login(request)
#         # print(status, response)
#         if status == 200:
#             return function(request, response, *args, **kwargs)
#         else:
#             return redirect('/signin/')
#     return wrap


def admin_signin_required(function):
    def wrap(request, *args, **kwargs):
        request.temp_cookie = request.COOKIES.get('admin_access')
        if 'admin_access' not in request.COOKIES and 'admin_refresh' not in request.COOKIES:
            return redirect('/signin/')
        # Check if the access token is present in the cookies
        elif 'admin_access' not in request.COOKIES:
            # If not, obtain the access token from the API endpoint
            access_token = get_access_token_from_api(request)
            expiry_time = get_expiry_time_from_access_token(access_token)

            admin_name, admin_image = get_admin_detail(request, access_token)
            request.admin_name = admin_name
            request.admin_image = admin_image
            request.temp_cookie = access_token

            # Set the access token in the response cookies
            response = function(request, *args, **kwargs)
            response.set_cookie('admin_access', access_token, expires=expiry_time)
            return response
        else:
            admin_name, admin_image = get_admin_detail(request)
            request.admin_name = admin_name
            request.admin_image = admin_image
        return function(request, *args, **kwargs)
    return wrap