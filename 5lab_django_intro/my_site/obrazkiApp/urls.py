from django.urls import path
# from .views import MyLoginView
from django.contrib.auth.views import LogoutView 
from . import views

app_name = "obrazkiApp"
urlpatterns = [
    path("", views.index, name="index"),
]