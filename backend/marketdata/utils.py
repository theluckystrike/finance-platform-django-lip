import yfinance as yf
from marketdata.models import OHLCTimeSeries


def yf_has_symbol(asset: str) -> bool:
    """
    Checks if an asset is available via the Yahoo Finance API.
    """
    info = yf.Ticker(asset).history(
        period='1mo',
        interval='1d')
    return len(info) > 0


def yf_get_all_historic_data(ticker: str) -> List[OHLCTimeSeries]:
    """
    Fetches all historic data for a given ticker.
    """
    data = yf.Ticker(ticker).history(period='max', interval='1d')
    ohlc_data = []
    for index, row in data.iterrows():
        ohlc_data.append(OHLCTimeSeries(
            date=row['Date'].strftime('%Y-%m-%d'),
            open=row['Open'],
            high=row['High'],
            low=row['Low'],
            close=row['Close'],
            volume=row['Volume']
        ))
    return ohlc_data
