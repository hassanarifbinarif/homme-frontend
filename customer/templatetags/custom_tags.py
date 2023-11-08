from django import template
from datetime import datetime
from django.template.defaultfilters import date

register = template.Library()


def convert_to_date(value, arg):
    if not value:
        return ''
    try:
        date_obj = datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')
    except Exception as e:
        return value
    formatted_date = date(date_obj, arg)
    return formatted_date


def multiply(value, arg):
    if not value:
        return ''
    try:
        total_value =  float(value) * float(arg)
    except Exception as e:
        print(e)
        return value
    return total_value


def divide(value, arg):
    if not value:
        return ''
    try:
        total_value = float(value) / float(arg)
    except Exception as e:
        print(e)
        return value
    return total_value


def plus(value, arg):
    if not value:
        return ''
    try:
        total_value = float(value) + float(arg)
    except Exception as e:
        print(e)
        return value
    return total_value


def percentage(value, arg):
    if not value:
        return ''
    try:
        print(value, arg)
        total_value = float(value) + float(arg)
    except Exception as e:
        print(e)
        return value
    return total_value


def get_page_numbers(value):
    if not value:
        return ''
    try:
        if value['count'] == 0:
            starting_record, ending_record, total_records = 0 
        else:
            starting_record = (value['currentPage'] - 1) * value['perPage'] + 1
            ending_record = value['currentPage'] * value['perPage']
            if ending_record > value['count']:
                ending_record = value['count']
            total_records = value['count']
            return f'{starting_record}-{ending_record} of {total_records}'
    except Exception as e:
        return value
    return value


def split_string(value, arg):
    if not value:
        return ''
    try:
        return value.split(arg)
    except Exception as e:
        print(e)
        return e


register.filter("custom_date", convert_to_date)
register.filter("multiply", multiply)
register.filter('divide', divide)
register.filter("plus", plus)
register.filter("percentage", percentage)
register.filter("page_number", get_page_numbers)
register.filter("split_string", split_string)