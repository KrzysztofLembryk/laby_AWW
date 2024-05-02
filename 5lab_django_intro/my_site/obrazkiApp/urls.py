from django.urls import path
# from .views import MyLoginView
from django.contrib.auth.views import LogoutView 
from . import views

app_name = "obrazkiApp"
urlpatterns = [
    path("", views.index, name="index"),
    path("svg_form/", views.svg_form_view, name="svg_img_form"),
    path("<int:svg_id>/", views.svg_detail, name="svg_detail"),
    path("svg_list/", views.list_svg_images, name="svg_list"),
    path("svg_modifiable_list/", views.svg_modifiable_list, name="svg_modifiable_list"),
    path("<int:svg_id>/modifiable/", views.svg_modifiable_detail, name="svg_modifiable_detail"),
    path("<int:svg_id>/<int:rect_id>/", views.svg_remove_rect, name="svg_remove_rect"),
]