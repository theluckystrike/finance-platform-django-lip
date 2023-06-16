import yfinance as yf
import matplotlib.pyplot as plt
plt.switch_backend("Agg")
# Fetch historical data
start_date = '2010-01-01'
end_date = '2023-06-14'
symbol = 'AAPL'  # Ticker symbol for Apple
data = yf.download(symbol, start=start_date, end=end_date)

# Reset index and keep only the 'Date' and 'Close' columns
data = data.reset_index()
data = data[['Date', 'Close']]

# Rename the columns for convenience
data.columns = ['Date', 'Price']

# Plotting the data
plt.figure(figsize=(12, 6))
plt.plot(data['Date'], data['Price'])
plt.title('Apple Stock Price')
plt.xlabel('Date')
plt.ylabel('Price')
plt.xticks(rotation=45)
plt.grid(True)
plt.savefig("apple.png")

