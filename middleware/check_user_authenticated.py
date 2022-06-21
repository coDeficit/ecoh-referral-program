import requests
from config.settings import API_HOST
import logging

import urllib
import json

format = "%(asctime)s: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

class Middleware:
    def __init__(self, get_response) -> None:
        self.get_response = get_response
        self.api_url = "api/people"

    def __call__(self, request):
        print("Calling middleware")
        if "user" in request.session:
            try:
                auth_token = request.session["user"]["auth_token"]

                headers = {'Authorization': f'Token {auth_token}'}
                response = requests.get(url='/'.join( [ API_HOST, self.api_url ] ), headers=headers)

                if response.status_code in [200, 201]:
                    request.session["is_authenticated"] = True
                    res = self.get_response(request)
                    person = request.session.setdefault("person", request.session["user"]["person"])
                    
                    try:
                        res.set_cookie("auth_token", request.session["user"]["auth_token"])
                    except KeyError as e:
                        logging.error(f"KeyError: {e}")
                    
                    try:
                        res.set_cookie("username", request.session["user"]["username"])
                    except KeyError as e:
                        logging.error(f"KeyError: {e}")

                    try:    
                        res.set_cookie("person", urllib.parse.quote_plus(json.dumps(request.session["person"])))
                    except Exception as e:
                        logging.error(f"KeyError: {e}")

                    try:
                        res.set_cookie("person_id", request.session["person"]["id"])
                    except Exception as e:
                        logging.error(f"KeyError: {e}")

                    try:
                        res.set_cookie("api_host", urllib.parse.quote_plus(API_HOST))
                    except (ImportError) as e:                    
                        logging.error(f"ImportError: {e}")

                    try:
                        res.set_cookie("user", urllib.parse.quote_plus(response.content))
                    except KeyError as e:
                        print(f"KeyError when setting user cookie in check_user_authenticated: {e}")
                        logging.error(f"KeyError when setting user cookie in check_user_authenticated: {e}")
                    
                    return res
                else:
                    request.session["is_authenticated"] = False

            except KeyError as e:
                request.session["is_authenticated"] = False
                logging.error(f"{e}")
            except ConnectionError as e:
                request.session["is_authenticated"] = False
                logging.error(f"{e}")
        
        else:
            request.session["is_authenticated"] = False
        
        return self.get_response(request)