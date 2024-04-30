from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

def home_view(request):
    return render(request, 'loginApp/home.html')

@login_required
def index(request):
    return render(request, 'loginApp/index.html')

def loginview(request):
    if request.method == 'POST':
        user = authenticate(request, username=request.POST["username"],
                            password=request.POST["password"])
        if user is not None:
            login(request, user)
            messages.success(request, 'Logged in successfully')
            return redirect('index')
        else:
            messages.error(request, 'Logged in Fail')
    return render(request, 'loginApp/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')