# Dashboard Feature Setup Guide

## Overview
This guide covers the implementation of the new Dashboard feature and fixes for the Report script population issues.

## What's Been Implemented

### 1. Dashboard Feature
- **New Dashboard Tab**: Added to main navigation menu
- **Dashboard List Page**: Shows available dashboards with descriptions
- **S&P Member Returns Dashboard**: 
  - Sortable columns for all metrics
  - YTD returns sorted by default (highest to lowest)
  - Search functionality
  - CSV export capability
  - Real-time data refresh
  - Summary statistics cards

### 2. Public Access Configuration
- **Public Routes**: Dashboard is accessible at `/public/dashboard` without authentication
- **Protected Routes**: All other sections remain behind authentication
- **Public Layout**: Separate layout for public dashboard with login prompt

### 3. Google AdSense Integration
- **Components Created**:
  - `GoogleAdsense.tsx`: Display component for ads
  - `GoogleAdsConfig.tsx`: Configuration component
- **Placement**: Ads display in public dashboard layout

### 4. Report Script Population Fix
- **Issue Fixed**: Scripts now properly populate in the report update modal
- **Solution**: 
  - Always fetch fresh script data when modal opens
  - Increased per_page limit to 1000 to ensure all scripts load
  - Added proper error handling

## Setup Instructions

### 1. Google AdSense Setup
1. Sign up for Google AdSense at https://www.google.com/adsense/
2. Get your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
3. Create ad units in your AdSense dashboard
4. Update the following files with your actual AdSense credentials:
   - `/frontend/src/Layout/PublicLayout.tsx`: Replace `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID
   - `/frontend/src/Comopnent/GoogleAds/GoogleAdsense.tsx`: Update slot IDs as needed

### 2. Connect Real Data to S&P Dashboard
Currently, the S&P Member Returns dashboard uses mock data. To connect real data:

1. Create or identify the S&P members script in your backend
2. Update `/frontend/src/pages/Dashboard/SPMemberReturns.tsx`:
   ```typescript
   // Replace this section in loadData function:
   // const mockData = generateMockData();
   
   // With actual API call:
   const scriptId = 'YOUR_SCRIPT_ID'; // Replace with actual script ID
   const response = await GetScriptByID({ id: scriptId });
   const scriptData = parseScriptData(response.data);
   setData(scriptData);
   ```

### 3. Backend API Endpoints (if needed)
If you need dedicated dashboard endpoints, create them in Django:

```python
# backend/marketdata/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])  # Public access
def sp_member_returns(request):
    # Fetch and return S&P member data
    pass
```

## File Structure

### New Files Created:
```
frontend/src/
├── pages/Dashboard/
│   ├── DashboardList.tsx      # Dashboard selection page
│   ├── SPMemberReturns.tsx    # S&P 500 dashboard
│   └── Dashboard.css          # Dashboard styles
├── Layout/
│   └── PublicLayout.tsx       # Public layout with ads
├── Routes/
│   └── PublicRoute.tsx        # Public route configuration
└── Comopnent/GoogleAds/
    ├── GoogleAdsense.tsx      # Ad display component
    └── GoogleAdsConfig.tsx    # Ad configuration

```

### Modified Files:
- `frontend/src/Menu.ts` - Added dashboard menu item
- `frontend/src/types/MenuTypes.ts` - Added dashboard type
- `frontend/src/Routes/AuthRoute.tsx` - Added dashboard routes
- `frontend/src/index.tsx` - Added public routes
- `frontend/src/pages/Reports/ReportUpdateModal.tsx` - Fixed script population

## Testing

### 1. Test Dashboard Access
- Navigate to `/dashboard` (authenticated)
- Navigate to `/public/dashboard` (public access)
- Verify both work correctly

### 2. Test S&P Dashboard Features
- Sort columns by clicking headers
- Search for specific tickers/companies
- Export data to CSV
- Refresh data

### 3. Test Report Script Population
- Go to Reports tab
- Open a report
- Click "Add Scripts"
- Verify all scripts appear in dropdown

## Deployment Considerations

1. **Environment Variables**: Add AdSense publisher ID to environment variables
2. **CORS**: Ensure public routes are properly configured for CORS if needed
3. **SSL**: Google AdSense requires HTTPS in production
4. **Domain Verification**: Verify your domain in Google AdSense console

## Future Enhancements

1. **Additional Dashboards**: 
   - Market Overview
   - Sector Analysis
   - Volatility Tracker

2. **Data Sources**:
   - Connect to real-time market data APIs
   - Implement WebSocket for live updates

3. **User Preferences**:
   - Save dashboard layouts
   - Custom column selections
   - Personalized watchlists

## Troubleshooting

### Scripts Not Showing in Report Modal
- Check browser console for API errors
- Verify authentication token is valid
- Ensure backend is returning all scripts

### Dashboard Not Loading
- Check network tab for failed API calls
- Verify route configuration
- Check for JavaScript errors in console

### Google Ads Not Displaying
- Ads only show on approved domains
- Need real traffic for ads to appear
- Check AdSense account for policy violations

## Support
For issues or questions, please check:
- Browser console for errors
- Network tab for API responses
- Django backend logs for server errors
