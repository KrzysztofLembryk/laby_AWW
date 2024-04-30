from django.urls import path
# from .views import MyLoginView
from django.contrib.auth.views import LogoutView 
from . import views

urlpatterns = [
    path("", views.home_view, name="home"),
    path('login/', views.loginview, name='login'),
    path("index/", views.index, name="index"),
    path('logout/', views.logout_view ,name='logout'),
    path("guest/", views.guest, name="guest"),
]