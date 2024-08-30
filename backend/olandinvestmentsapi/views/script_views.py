# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
# Create your views here.


class ScriptUploadView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        return


