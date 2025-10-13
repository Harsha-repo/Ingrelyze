from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Create your views here.



@method_decorator(csrf_exempt, name='dispatch')
class Register_view(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        print("Register view called")
        print("Request data:", request.data)
        response = super().post(request, *args, **kwargs)
        print("Response status:", response.status_code)
        if response.status_code == 400:
            print("Validation errors:", response.data)
        return response
    
    