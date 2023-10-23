from django.shortcuts import redirect
from customer.helpers import check_admin_login


def admin_signin_required(function):
    def wrap(request, *args, **kwargs):
        status, response = check_admin_login(request)
        # print(status, response)
        if status == 200:
            return function(request, response, *args, **kwargs)
        else:
            return redirect('/signin/')
    return wrap