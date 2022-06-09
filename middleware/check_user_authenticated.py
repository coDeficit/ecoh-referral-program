import requests
from config.settings import API_HOST

class Middleware:
    def __init__(self, get_response) -> None:
        self.get_response = get_response

    def __call__(self, request):
        if "auth_token" in request.session:
            auth_token = request.session["auth_token"]
            headers = {'Authorization': f'Token {auth_token}'}
            response = requests.get(url='/'.join( [ API_HOST, 'users', 'test_auth' ] ), headers=headers)

            if response.status_code in [200, 201]:
                request.session["is_authenticated"] = True
            else:
                request.session["is_authenticated"] = False
        else:
            request.session["is_authenticated"] = False
        pass