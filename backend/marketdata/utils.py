import yfinance as yf


def yf_has_symbol(asset: str) -> bool:
    """
    Checks if an asset is available via the Yahoo Finance API.
    """
    info = yf.Ticker(asset).history(
        period='1mo',
        interval='1d')
    return len(info) > 0
