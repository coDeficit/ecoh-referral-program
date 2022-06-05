import json
from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

from config.settings import BASE_DIR
import os

def clean_country_code(country_code: str):
    with open(os.path.join(BASE_DIR, "country_codes.json")) as file:
        codes = json.load(file)
            
        if country_code not in codes.keys():
            raise ValidationError(
                _("Invalid country code")
            )
    return country_code

class PhoneNumberForm(forms.Form):
    country_code = forms.CharField(max_length=6)
    number = forms.CharField(max_length=15)

    def clean_country_code(self):
        country_code = self.cleaned_data['country_code']
        return clean_country_code(country_code)

class PhoneNumberAndCodeForm(PhoneNumberForm):
    code = forms.CharField(max_length=5)

class UserLoginForm(forms.Form):
    identifier = forms.CharField(max_length=256)
    password = forms.CharField(max_length=256)