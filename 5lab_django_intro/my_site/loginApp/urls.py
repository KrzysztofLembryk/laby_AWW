from django.urls import path
# from .views import MyLoginView
from django.contrib.auth.views import LogoutView 
from . import views

app_name = "loginApp"
urlpatterns = [
    path("", views.home_view, name="home"),
    path('login/', views.loginview, name='login'),
    path("afterLogin/", views.afterLogin, name="afterLogin"),
    path('logout/', views.logout_view ,name='logout'),
]