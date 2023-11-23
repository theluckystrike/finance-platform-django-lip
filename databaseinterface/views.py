from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import OHLCSerializer, UserSerializer, IndexActionSerializer, IndexConstituentSerializer, RateSerializer
from .models import OHLCData, IndexConstituent, IndexAction, Rate
from django.contrib.auth.models import User
# Create your views here.
from rest_framework.response import Response
from rest_framework import status


class OHLCViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    serializer_class = OHLCSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = OHLCData.objects.all().order_by("date")
        ticker = self.request.query_params.get("ticker", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if ticker:
            queryset = queryset.filter(ticker=ticker)
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        return queryset


class IndexActionViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    queryset = IndexAction.objects.all().order_by("date")
    serializer_class = IndexActionSerializer
    permission_classes = [permissions.IsAuthenticated]


class IndexConstituentViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    queryset = IndexConstituent.objects.all().order_by("date_added")
    serializer_class = IndexConstituentSerializer
    permission_classes = [permissions.IsAuthenticated]


class RateViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
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
