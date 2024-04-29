from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout

def index(request):
    return render(request, 'obrazki_app/index.html')

def login_view(request):
    if request.method == "POST":

        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            return redirect('index')
        else:
            return render(request, 'obrazki_app/login.html', {'error': 'Niepoprawne dane'})
    else:
        return render(request, 'obrazki_app/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')