from django.urls import path
from . import views

# The <int:question_id> in the path function is a path converter. It captures a portion of the URL as a variable, which is then passed to the view function as an argument.
# 
# Here's a breakdown of what it does:
# 
# <int:question_id>: This is a path converter. It captures a portion of the URL.
# int: This is the type of the converter. It specifies that the captured portion of the URL should be converted to an integer.
# question_id: This is the name of the variable that will hold the captured value. It's passed to the view function as an argument.
# 
# So, if you navigate to a URL like /5/, the 5 will be captured by the <int:question_id> path converter, converted to an integer, and then passed to the views.detail function as an argument named question_id.
# Exmaple: http://localhost:8000/5/
urlpatterns = [ 
    path('', views.index, name='index'),
    path("<int:question_id>/", views.detail, name="detail"),
    path("<int:question_id>/results/", views.results, name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
] 