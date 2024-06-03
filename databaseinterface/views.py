from rest_framework import viewsets, permissions, generics
from .serializers import (
    OHLCSerializer,
    UserSerializer,
    IndexActionSerializer,
    IndexConstituentSerializer,
    RateSerializer,
    StockExchangeDataSerializer,
    ScriptSerializer,
    BlackRockIndexDataSerializer,
)
from .models import (
    OHLCData,
    IndexConstituent,
    IndexAction,
    Rate,
    StockExchangeData,
    BlackRockIndexData,
)
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from scriptupload.models import Script


class OHLCViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    serializer_class = OHLCSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = OHLCData.objects.all().order_by("date")
        tickers = self.request.query_params.getlist("ticker", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if tickers:
            queryset = queryset.filter(ticker__in=tickers)
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
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    serializer_class = IndexActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = IndexAction.objects.all().order_by("date")
        tickers = self.request.query_params.getlist("ticker", None)
        index = self.request.query_params.getlist("index", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if tickers:
            queryset = queryset.filter(ticker__in=tickers)
        if index:
            queryset = queryset.filter(index__in=index)
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        return queryset


class IndexConstituentViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    serializer_class = IndexConstituentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = IndexConstituent.objects.all().order_by("date_added")
        tickers = self.request.query_params.getlist("ticker", None)
        index = self.request.query_params.getlist("index", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if tickers:
            queryset = queryset.filter(ticker__in=tickers)
        if index:
            queryset = queryset.filter(index__in=index)
        if start_date and end_date:
            queryset = queryset.filter(date_added__range=[start_date, end_date])
        return queryset


class RateViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    queryset = Rate.objects.all().order_by("date")
    serializer_class = RateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Rate.objects.all().order_by("date")
        countries = self.request.query_params.getlist("country", None)
        terms = self.request.query_params.getlist("term", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if countries:
            queryset = queryset.filter(country__in=countries)
        if terms:
            queryset = queryset.filter(term__in=terms)
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        return queryset


class StockExchangeDataViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    queryset = StockExchangeData.objects.all().order_by("date")
    serializer_class = StockExchangeDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = StockExchangeData.objects.all().order_by("date")
        exchange_name = self.request.query_params.getlist("exchange", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        print(exchange_name)
        if exchange_name:
            queryset = queryset.filter(exchange_name__in=exchange_name)
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        return queryset


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ScriptTableDataRetrieveView(generics.RetrieveAPIView):
    queryset = Script.objects.all()
    serializer_class = ScriptSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"


class BlackRockIndexDataViewSet(viewsets.ModelViewSet):

    queryset = BlackRockIndexData.objects.all().order_by("date")
    serializer_class = BlackRockIndexDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


    def get_queryset(self):
        queryset = self.queryset
        date = self.request.query_params.get("date", None)
        if date:
            queryset = queryset.filter(date=date)
        return queryset
