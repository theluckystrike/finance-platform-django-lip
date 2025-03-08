from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, mixins
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from marketdata.models import OHLCTimeSeries, TickerSymbol
from rest_framework import status
from marketdata.serializers import OHLCSerializer, TickerSymbolSerializer
from marketdata.utils import yf_has_symbol, yf_get_all_historic_data


class OHLCViewSet(mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):

    serializer_class = OHLCSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = OHLCTimeSeries.objects.all().order_by("-date")
        tickers = self.request.query_params.getlist("ticker", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if tickers:
            queryset = queryset.filter(symbol__in=tickers)
        else:
            return OHLCTimeSeries.objects.none()
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        elif start_date and not end_date:
            queryset = queryset.filter(date__gte=start_date)
        elif not start_date and end_date:
            queryset = queryset.filter(date__lte=end_date)
        return queryset


class TickerSymbolViewSet(mixins.ListModelMixin,
                          viewsets.GenericViewSet,
                          mixins.CreateModelMixin,
                          mixins.RetrieveModelMixin):
    lookup_field = "symbol"
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    queryset = TickerSymbol.objects.all().order_by("symbol")
    serializer_class = TickerSymbolSerializer
    pagination_class = None

    def create(self, request, *args, **kwargs):
        symbol = request.data.get("symbol", None)
        if not symbol or not yf_has_symbol(symbol):
            return Response({"error": f"Invalid ticker symbol. No data found for {symbol} in past 30 days"}, status=status.HTTP_400_BAD_REQUEST)
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            historic_data = yf_get_all_historic_data(
                get_object_or_404(TickerSymbol, symbol=symbol))
            OHLCTimeSeries.objects.bulk_create(historic_data, batch_size=1000)
        return response
