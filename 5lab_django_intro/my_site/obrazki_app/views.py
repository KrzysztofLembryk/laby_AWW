from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# @login_required
def index(request):
    return render(request, 'obrazki_app/index.html')
#     if request.user.is_authenticated:
#         # User is logged in
#         # Add your code here for logged in users
#         return render(request, 'obrazki_app/index.html')
#     else:
#         # User is not logged in
#         # Add your code here for non-logged in users
#         return redirect('login')

def login_ArtUser(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            return redirect('index')
        else:
            return render(request, 'obrazki_app/login.html', {'error': 'Niepoprawne dane'})

    else:
        # Jesli user nie zrobil POST to wyswietlamy mu po prostu strone
        return render(request, "obrazki_app/login.html")


def logout_view(request):
    logout(request)
    return redirect('login')