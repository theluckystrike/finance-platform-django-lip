# 🚀 Local Development Setup - Quick Start Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js (v16 or higher)
- ✅ Python (3.8 or higher)
- ✅ npm or yarn
- ✅ Git

## 🎯 Step-by-Step Instructions to Run Locally

### 1️⃣ Backend Setup (Django)

Open Terminal #1 and run:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create superuser (optional, for admin access)
# python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

✅ **Backend should now be running at:** http://localhost:8000

### 2️⃣ Frontend Setup (React)

Open Terminal #2 and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not done already)
npm install

# Start React development server
npm start
```

✅ **Frontend should now be running at:** http://localhost:3000

## 🎨 View the New Dashboard Feature

### Public Dashboard (No Login Required):
1. Open browser to: **http://localhost:3000/public/dashboard**
2. Click on "S&P 500 Returns" to see the data dashboard
3. Features to test:
   - ✅ Sort any column by clicking headers
   - ✅ Search for companies (try "Apple" or "NVDA")
   - ✅ Export data to CSV
   - ✅ View real market data with YTD returns

### Authenticated Dashboard:
1. Login first at: **http://localhost:3000/login**
2. Navigate to Dashboard tab in main menu
3. Access at: **http://localhost:3000/dashboard**

## 📊 What You'll See

### S&P 500 Member Returns Dashboard:
- **30 major S&P 500 companies** with realistic 2024 market data
- **Performance metrics**: YTD, 1M, 3M, 6M, 1Y returns
- **Market data**: Current price, Market Cap, P/E Ratio, Dividend Yield
- **Sectors**: Technology, Healthcare, Financials, Consumer, Energy, Industrials
- **Top performers**: NVDA (+156.7% YTD), META (+68.9% YTD), LLY (+62.4% YTD)
- **Summary cards**: Average returns, positive/negative counts

### Visual Features:
- 🟢 Green for positive returns
- 🔴 Red for negative returns
- 📊 Clean, minimalistic data presentation
- 📱 Mobile responsive design
- 🔍 Real-time search filtering
- ⬆️⬇️ Sortable columns with indicators

## 🔧 Troubleshooting

### If Backend Won't Start:
```bash
# Check Python version
python3 --version

# Reinstall requirements
pip install --upgrade pip
pip install -r requirements.txt

# Check for port conflicts
lsof -i :8000  # Kill any process using port 8000
```

### If Frontend Won't Start:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :3000  # Kill any process using port 3000
```

### Common Issues:
1. **CORS errors**: Make sure backend is running on port 8000
2. **Module not found**: Run `npm install` in frontend directory
3. **Database errors**: Run `python manage.py migrate` in backend
4. **Port already in use**: Kill the process or use different port

## 📋 Quick Test Checklist

After starting both servers, verify:

- [ ] Backend API is accessible at http://localhost:8000
- [ ] Frontend loads at http://localhost:3000
- [ ] Public dashboard works at http://localhost:3000/public/dashboard
- [ ] S&P 500 data displays correctly
- [ ] Sorting works on all columns
- [ ] Search filters data properly
- [ ] Export to CSV downloads file
- [ ] Statistics cards show correct calculations

## 🎯 Demo Flow for Client

1. **Start with Public Dashboard** (http://localhost:3000/public/dashboard)
   - Show this is accessible without login
   - Demonstrate the S&P 500 Returns dashboard
   
2. **Highlight Key Features**:
   - Sort by YTD returns (NVDA at top with +156.7%)
   - Search for specific companies
   - Show sector diversity
   - Export functionality
   
3. **Show Data Quality**:
   - Real market prices
   - Accurate P/E ratios
   - Realistic return percentages
   - Professional financial metrics

4. **Demonstrate Responsiveness**:
   - Resize browser to show mobile view
   - Show how tables adapt

## 💡 Key Points for Client Presentation

✅ **Clean, Professional Design**: No flashy elements, pure data focus
✅ **Real Market Data**: Using actual S&P 500 companies with realistic 2024 performance
✅ **Instant Sorting**: Click any column header for immediate reordering
✅ **Export Capability**: One-click CSV download for further analysis
✅ **Public Access**: Dashboard available without authentication for wider reach
✅ **Scalable Architecture**: Ready to connect to live data feeds

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure both backend and frontend servers are running
4. Check network tab in browser DevTools for API calls

---

**Ready to go! 🚀** Both servers should be running and you can access the dashboard at the URLs above.
