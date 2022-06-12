"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name='index'),
    path("login/", views.login, name='login'),
    path("signup/", views.signup, name='signup'),
    path("verify-phone/", views.verify_phone, name='verify-phone'),
    path("get-people/", views.get_people),
    path("home/team/", views.team, name='team'),
    path("home/wallet/", views.wallet, name='wallet'),
    path("home/", views.dashboard, name='dashboard'),
    path("<slug:slug>/team/", views.team, name='slug-team'),
    path("<slug:slug>/wallet/", views.wallet, name='slug-wallet'),
    path("<slug:slug>/", views.dashboard, name='slug-dashboard'),
]