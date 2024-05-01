from django.urls import path
# from .views import MyLoginView
from django.contrib.auth.views import LogoutView 
from . import views

app_name = "obrazkiApp"
urlpatterns = [
    path("", views.index, name="index"),
    path("svg_form/", views.svg_form_view, name="svg_img_form"),
]