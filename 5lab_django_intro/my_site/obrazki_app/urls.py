from django.urls import path
from . import views


app_name = "obrazki_app"
urlpatterns = [ 
    path('', views.index, name='index'),
]