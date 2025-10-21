#!/usr/bin/env python3
"""
Create comprehensive test data for Finance Platform
Tests: Script Tree, Category Management, and Updates
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'financeplatform.settings')
django.setup()

from scriptupload.models import Script, Category
from olandinvestmentsapi.models import Summary
from django.contrib.auth.models import User

print("🚀 Creating Test Data for Finance Platform...\n")

# Get or create admin user
admin, _ = User.objects.get_or_create(
    username='admin',
    defaults={'email': 'admin@example.com', 'is_superuser': True, 'is_staff': True}
)
admin.set_password('testpass123')
admin.save()

# Clear existing test data
print("🧹 Cleaning existing data...")
Script.objects.filter(name__contains='Test').delete()
Category.objects.all().delete()

# ==========================================
# CREATE CATEGORY HIERARCHY (3 LEVELS)
# ==========================================
print("\n📁 Creating Category Hierarchy...")

# Level 0 Categories (Root)
financial_analysis = Category.objects.create(name="Financial Analysis")
print(f"✅ Level 0: {financial_analysis.name}")

trading_strategies = Category.objects.create(name="Trading Strategies")
print(f"✅ Level 0: {trading_strategies.name}")

risk_management = Category.objects.create(name="Risk Management")
print(f"✅ Level 0: {risk_management.name}")

# Level 1 Categories (Sub-categories)
fundamental = Category.objects.create(
    name="Fundamental Analysis",
    parent_category=financial_analysis
)
print(f"  ✅ Level 1: {fundamental.name}")

technical = Category.objects.create(
    name="Technical Analysis",
    parent_category=financial_analysis
)
print(f"  ✅ Level 1: {technical.name}")

algorithmic = Category.objects.create(
    name="Algorithmic Trading",
    parent_category=trading_strategies
)
print(f"  ✅ Level 1: {algorithmic.name}")

portfolio = Category.objects.create(
    name="Portfolio Management",
    parent_category=risk_management
)
print(f"  ✅ Level 1: {portfolio.name}")

# Level 2 Categories (Leaf nodes - where scripts are assigned)
equity_valuation = Category.objects.create(
    name="Equity Valuation",
    parent_category=fundamental
)
print(f"    ✅ Level 2: {equity_valuation.name}")

financial_ratios = Category.objects.create(
    name="Financial Ratios",
    parent_category=fundamental
)
print(f"    ✅ Level 2: {financial_ratios.name}")

trend_analysis = Category.objects.create(
    name="Trend Analysis",
    parent_category=technical
)
print(f"    ✅ Level 2: {trend_analysis.name}")

momentum = Category.objects.create(
    name="Momentum Indicators",
    parent_category=technical
)
print(f"    ✅ Level 2: {momentum.name}")

mean_reversion = Category.objects.create(
    name="Mean Reversion",
    parent_category=algorithmic
)
print(f"    ✅ Level 2: {mean_reversion.name}")

var_analysis = Category.objects.create(
    name="VaR Analysis",
    parent_category=portfolio
)
print(f"    ✅ Level 2: {var_analysis.name}")

# ==========================================
# CREATE TEST SCRIPTS
# ==========================================
print("\n📊 Creating Test Scripts...")

scripts_data = [
    {
        'name': 'Test - DCF Valuation Model',
        'category': equity_valuation,
        'description': 'Discounted Cash Flow valuation model for equity analysis',
        'code': '''import pandas as pd
import numpy as np

def dcf_valuation(fcf_projections, discount_rate, terminal_growth_rate):
    """
    Calculate company valuation using DCF method
    """
    pv_fcf = [fcf / (1 + discount_rate) ** i for i, fcf in enumerate(fcf_projections, 1)]
    terminal_value = fcf_projections[-1] * (1 + terminal_growth_rate) / (discount_rate - terminal_growth_rate)
    pv_terminal = terminal_value / (1 + discount_rate) ** len(fcf_projections)
    
    enterprise_value = sum(pv_fcf) + pv_terminal
    return {
        'enterprise_value': enterprise_value,
        'pv_fcf': sum(pv_fcf),
        'pv_terminal': pv_terminal
    }

# Example usage
fcf_projections = [100, 110, 121, 133, 146]  # 10% growth
result = dcf_valuation(fcf_projections, 0.10, 0.03)
print(f"Enterprise Value: ${result['enterprise_value']:.2f}M")
'''
    },
    {
        'name': 'Test - P/E Ratio Calculator',
        'category': financial_ratios,
        'description': 'Calculate and analyze P/E ratios',
        'code': '''import yfinance as yf
import pandas as pd

def calculate_pe_ratio(ticker):
    """
    Calculate P/E ratio and compare to industry average
    """
    stock = yf.Ticker(ticker)
    info = stock.info
    
    pe_ratio = info.get('trailingPE', 0)
    forward_pe = info.get('forwardPE', 0)
    
    return {
        'ticker': ticker,
        'pe_ratio': pe_ratio,
        'forward_pe': forward_pe,
        'market_cap': info.get('marketCap', 0)
    }

# Example
result = calculate_pe_ratio('AAPL')
print(f"{result['ticker']}: P/E = {result['pe_ratio']:.2f}")
'''
    },
    {
        'name': 'Test - Moving Average Crossover',
        'category': trend_analysis,
        'description': 'Detect moving average crossovers for trend signals',
        'code': '''import pandas as pd
import numpy as np

def moving_average_crossover(prices, short_window=20, long_window=50):
    """
    Identify moving average crossover signals
    """
    df = pd.DataFrame({'price': prices})
    df['SMA_short'] = df['price'].rolling(window=short_window).mean()
    df['SMA_long'] = df['price'].rolling(window=long_window).mean()
    
    df['signal'] = 0
    df.loc[df['SMA_short'] > df['SMA_long'], 'signal'] = 1  # Bullish
    df.loc[df['SMA_short'] < df['SMA_long'], 'signal'] = -1  # Bearish
    
    return df

# Example
prices = np.random.randn(100).cumsum() + 100
signals = moving_average_crossover(prices)
print(f"Crossover signals detected: {(signals['signal'].diff() != 0).sum()}")
'''
    },
    {
        'name': 'Test - RSI Momentum Indicator',
        'category': momentum,
        'description': 'Calculate Relative Strength Index',
        'code': '''import pandas as pd

def calculate_rsi(prices, period=14):
    """
    Calculate RSI momentum indicator
    """
    df = pd.DataFrame({'price': prices})
    delta = df['price'].diff()
    
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi

# Example
prices = [44, 44.5, 45, 44, 43, 42, 43, 44, 45, 46, 47, 46, 45, 44, 43]
rsi = calculate_rsi(prices)
print(f"Current RSI: {rsi.iloc[-1]:.2f}")
'''
    },
    {
        'name': 'Test - Bollinger Bands Mean Reversion',
        'category': mean_reversion,
        'description': 'Mean reversion strategy using Bollinger Bands',
        'code': '''import pandas as pd
import numpy as np

def bollinger_bands(prices, window=20, num_std=2):
    """
    Calculate Bollinger Bands for mean reversion signals
    """
    df = pd.DataFrame({'price': prices})
    df['sma'] = df['price'].rolling(window=window).mean()
    df['std'] = df['price'].rolling(window=window).std()
    
    df['upper_band'] = df['sma'] + (df['std'] * num_std)
    df['lower_band'] = df['sma'] - (df['std'] * num_std)
    
    # Generate signals
    df['signal'] = 0
    df.loc[df['price'] < df['lower_band'], 'signal'] = 1  # Buy
    df.loc[df['price'] > df['upper_band'], 'signal'] = -1  # Sell
    
    return df

# Example
prices = np.random.randn(100).cumsum() + 100
bands = bollinger_bands(prices)
print(f"Buy signals: {(bands['signal'] == 1).sum()}")
print(f"Sell signals: {(bands['signal'] == -1).sum()}")
'''
    },
    {
        'name': 'Test - Portfolio VaR Calculator',
        'category': var_analysis,
        'description': 'Calculate Value at Risk for portfolio',
        'code': '''import numpy as np
import pandas as pd

def calculate_var(returns, confidence_level=0.95):
    """
    Calculate Value at Risk using historical simulation
    """
    returns = np.array(returns)
    var_percentile = (1 - confidence_level) * 100
    var = np.percentile(returns, var_percentile)
    
    # Conditional VaR (CVaR or Expected Shortfall)
    cvar = returns[returns <= var].mean()
    
    return {
        'var': var,
        'cvar': cvar,
        'confidence_level': confidence_level
    }

# Example
portfolio_returns = np.random.normal(0.001, 0.02, 252)  # Daily returns
risk_metrics = calculate_var(portfolio_returns, 0.95)
print(f"95% VaR: {risk_metrics['var']:.2%}")
print(f"95% CVaR: {risk_metrics['cvar']:.2%}")
'''
    }
]

for script_data in scripts_data:
    script = Script.objects.create(
        name=script_data['name'],
        category=script_data['category'],
        description=script_data['description'],
        code=script_data['code'],
        user=admin,
        last_run_status='not_run'
    )
    print(f"✅ Created: {script.name} → {script.category.name}")

# ==========================================
# CREATE TEST SUMMARIES
# ==========================================
print("\n📝 Creating Test Summaries...")

summaries_data = [
    {
        'title': 'Q4 2024 Market Analysis Summary',
        'description': 'Comprehensive analysis of Q4 2024 market trends',
        'content': '''# Q4 2024 Market Analysis

## Key Findings
- S&P 500 up 12% YTD
- Tech sector leading with 18% gains
- Energy sector volatile due to geopolitical factors

## Top Performers
1. NVDA: +156% (AI boom)
2. META: +68% (Efficiency improvements)
3. LLY: +62% (GLP-1 drugs)

## Recommendations
- Maintain overweight position in tech
- Monitor interest rate decisions
- Diversify into defensive sectors
'''
    },
    {
        'title': 'Risk Assessment Report - December 2024',
        'description': 'Portfolio risk analysis for December',
        'content': '''# Risk Assessment Report

## Portfolio Metrics
- Total VaR (95%): -2.3%
- Sharpe Ratio: 1.45
- Max Drawdown: -8.2%

## Risk Factors
1. **Market Risk**: Elevated volatility expected
2. **Interest Rate Risk**: Fed policy uncertainty
3. **Geopolitical Risk**: Global tensions

## Mitigation Strategies
- Increase hedge positions
- Diversify across sectors
- Maintain liquidity buffer
'''
    }
]

for summary_data in summaries_data:
    summary = Summary.objects.create(
        title=summary_data['title'],
        description=summary_data['description'],
        content=summary_data['content'],
        user=admin
    )
    print(f"✅ Created: {summary.title}")

# ==========================================
# SUMMARY
# ==========================================
print("\n" + "="*50)
print("✅ TEST DATA CREATION COMPLETE!")
print("="*50)
print(f"\n📊 Summary:")
print(f"  • Categories: {Category.objects.count()} (3-level hierarchy)")
print(f"  • Scripts: {Script.objects.count()}")
print(f"  • Summaries: {Summary.objects.count()}")
print(f"  • Users: {User.objects.count()}")

print(f"\n🌐 Access URLs:")
print(f"  • Frontend: http://localhost:4200")
print(f"  • Script Tree: http://localhost:4200/script-tree")
print(f"  • All Scripts: http://localhost:4200/all-scripts")
print(f"  • Admin Panel: http://localhost:8000/admin/")

print(f"\n🔐 Login Credentials:")
print(f"  • Username: admin")
print(f"  • Password: testpass123")

print(f"\n🧪 Testing Checklist:")
print(f"  [ ] 1. Navigate to Script Tree and verify 3-level hierarchy displays")
print(f"  [ ] 2. Click categories to filter scripts")
print(f"  [ ] 3. Edit a script and change its category")
print(f"  [ ] 4. Verify real-time updates without manual refresh")
print(f"  [ ] 5. Check script synchronization across views")
print(f"  [ ] 6. Test category filtering in All Scripts page")

print(f"\n✨ All features from Classification Bugs Fix Report are now testable!\n")

