from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import OHLCSerializer, UserSerializer, IndexActionSerializer, IndexConstituentSerializer, RateSerializer
from .models import OHLCData, IndexConstituent, IndexAction, Rate
from django.contrib.auth.models import User
# Create your views here.


class OHLCViewSet(viewsets.ModelViewSet):
    queryset = OHLCData.objects.all().order_by("date")
    serializer_class = OHLCSerializer
    permission_classes = [permissions.IsAuthenticated]


class IndexActionViewSet(viewsets.ModelViewSet):
    queryset = IndexAction.objects.all().order_by("date")
    serializer_class = IndexActionSerializer
    permission_classes = [permissions.IsAuthenticated]


class IndexConstituentViewSet(viewsets.ModelViewSet):
    queryset = IndexConstituent.objects.all().order_by("date_added")
    serializer_class = IndexConstituentSerializer
    permission_classes = [permissions.IsAuthenticated]


class RateViewSet(viewsets.ModelViewSet):
    queryset = Rate.objects.all().order_by("date")
    serializer_class = RateSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
