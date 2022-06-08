import json
import os
from django.shortcuts import redirect, render
from django.utils import timezone
from django.utils.translation import gettext as _
import requests

from config.forms import PhoneNumberAndCodeForm, PhoneNumberForm, UserLoginForm, clean_country_code
from config.settings import API_HOST
from rest_framework.response import Response
from rest_framework.decorators import renderer_classes, api_view
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer


def index(request):
    return render(request, "index.html")

def login(request):
    if request.method == "POST":
        form = UserLoginForm(request.POST)

        if form.is_valid():
            data = form.cleaned_data
            url = f"{API_HOST}/users/login"
            # make a request to the main API
            response = requests.post(url, data=data)

            if response.status_code == 200:
                request.session["user"] = json.loads(response.content) 
            else:
                return render(request, "login-2.html", {'form': form, 'errors': response.content})

        else:
            return render(request, "login-2.html", {'form': form})
            
    return render(request, "login-2.html")

@api_view(('GET', ))
@renderer_classes( (JSONRenderer, ) )
def get_people(request):
    token = "f3bb73032d90661668b2617a2dbde29594200f72a1b1290f6e6801d297c9eb2c"
    response = requests.get(url=f"{API_HOST}/api/people", headers={"Authorization": f"Token {token}"})
    print(response.status_code)
    print(response.content)
    return Response(response.content)

def signup(request):
    if "number-verified" in request.session:
        if request.session["number-verified"]:
            return render(request, "signup.html")
        else:
            return redirect("verify-phone")
    else:
        request.session["number-verified"] = False
        request.session["requests_sent"] = []
        return redirect("verify-phone")

def verify_phone(request):
    CODE_LENGTH = 6
    try:
        if not request.session["requests_sent"]:
            request.session['requests_sent'] = []
    except KeyError:
        request.session["requests_sent"] = []

    if request.method == "POST":
        action = "SEND"
        action = request.POST.get("action")
        form = None
        has_error = False

        if action.upper() == "SEND":
            form = PhoneNumberForm(request.POST)

            if form.is_valid():
                url = '/'.join([API_HOST, "users", "verify", "phone"])
                data = form.cleaned_data
            else:
                has_error = True

        elif action.upper() == "VERIFY":
            requests_sent = request.session["requests_sent"]
            if isinstance(requests_sent, list) and len(requests_sent) > 0:
                code = request.POST.getlist('code[]')
                code = ''.join(code)

                if len(code) < CODE_LENGTH:
                    return render(request, "verify-phone.html", {"errors": _("The code has to be of at least %(CODE_LENGTH)d digits" % {'CODE_LENGTH': CODE_LENGTH} )})

                action = "VERIFY"
                latest_request_made = requests_sent[0] # the list is reversed such that the last element added is in the first index
                print(latest_request_made)
                

                if clean_country_code(latest_request_made["country_code"]):
                    url = '/'.join([API_HOST, "users", "verify", "validate"])
                    data = {**latest_request_made, "code": code}
                else:
                    has_error = True

        if not has_error:
            response = requests.post(url=url, data=data)

            if response.status_code == 200 and action == "VERIFY":
                request.session["person"] = response.content["person"]
                return redirect(request, "signup")

            elif response.status_code == 200 and action == "SEND":
                # add the current phone number, area code and timestamp to the session's request sent
                dictionary = { "country_code": form.cleaned_data['country_code'], "number": form.cleaned_data['number'], "time": timezone.now().strftime("%Y-%m-%d %H:%M:%S") }
                list_of_requests: list = request.session["requests_sent"]
                
                list_of_requests.append(dictionary)
                list_of_requests.reverse()

                request.session["requests_sent"] = list_of_requests
            else:
                print(response.content)
                return render(request, "verify-phone.html", context={"errors": response.content})
        else:
            print("Errors encountered")
            return render(request, "verify-phone.html", context={"form": form})

    return render(request, "verify-phone.html")

def base(request):
    return render(request, "base-template.html")

def dashboard(request):
    return render(request, "dashboard.html")