import React, { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { GetScriptByID } from '../../Redux/Script/ScriptApi';
import GoogleAdsense from '../../Comopnent/GoogleAds/GoogleAdsense';
import './Dashboard.css';

interface SPMemberData {
  ticker: string;
  companyName: string;
  ytdReturn: number;
  oneMonthReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  oneYearReturn: number;
  currentPrice: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  sector: string;
}

type SortField = keyof SPMemberData;
type SortDirection = 'asc' | 'desc';

const SPMemberReturns: React.FC = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<SPMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('ytdReturn');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Realistic S&P 500 mock data - September 2024 market snapshot
  const generateMockData = (): SPMemberData[] => {
    // Realistic market data based on actual S&P 500 companies
    const companiesData = [
      // Technology Leaders
      { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 223.45, marketCap: 3420, peRatio: 34.8, divYield: 0.44, ytd: 18.2, m1: 2.3, m3: 8.7, m6: 15.4, y1: 28.9 },
      { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', price: 428.30, marketCap: 3180, peRatio: 36.2, divYield: 0.72, ytd: 42.8, m1: 4.1, m3: 12.3, m6: 28.5, y1: 56.2 },
      { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 116.91, marketCap: 2870, peRatio: 65.3, divYield: 0.02, ytd: 156.7, m1: 8.9, m3: 32.1, m6: 89.3, y1: 198.4 },
      { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 165.52, marketCap: 2050, peRatio: 27.9, divYield: 0.00, ytd: 38.4, m1: -1.2, m3: 9.8, m6: 22.1, y1: 44.3 },
      { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 567.88, marketCap: 1440, peRatio: 28.4, divYield: 0.35, ytd: 68.9, m1: 5.6, m3: 18.9, m6: 42.3, y1: 92.1 },
      { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 168.42, marketCap: 768, peRatio: 32.1, divYield: 1.32, ytd: 52.3, m1: 3.8, m3: 14.2, m6: 31.7, y1: 78.9 },
      
      // Financial Sector
      { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', price: 460.26, marketCap: 984, peRatio: 9.8, divYield: 0.00, ytd: 28.9, m1: 2.1, m3: 7.3, m6: 18.2, y1: 35.6 },
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', price: 209.87, marketCap: 598, peRatio: 11.8, divYield: 2.23, ytd: 32.4, m1: 3.9, m3: 11.2, m6: 24.8, y1: 48.7 },
      { ticker: 'V', name: 'Visa Inc.', sector: 'Financials', price: 276.39, marketCap: 562, peRatio: 31.2, divYield: 0.75, ytd: 12.8, m1: 1.4, m3: 4.8, m6: 9.2, y1: 18.9 },
      { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financials', price: 487.92, marketCap: 456, peRatio: 37.8, divYield: 0.57, ytd: 18.6, m1: 2.8, m3: 6.9, m6: 14.3, y1: 24.7 },
      { ticker: 'BAC', name: 'Bank of America', sector: 'Financials', price: 39.84, marketCap: 313, peRatio: 13.2, divYield: 2.42, ytd: 24.3, m1: 1.8, m3: 8.4, m6: 18.9, y1: 42.1 },
      
      // Healthcare
      { ticker: 'LLY', name: 'Eli Lilly and Co.', sector: 'Healthcare', price: 912.43, marketCap: 869, peRatio: 112.3, divYield: 0.54, ytd: 62.4, m1: 7.2, m3: 21.8, m6: 38.9, y1: 94.2 },
      { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 567.89, marketCap: 524, peRatio: 23.4, divYield: 1.23, ytd: 8.9, m1: -2.3, m3: 3.2, m6: 6.8, y1: 12.4 },
      { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 164.78, marketCap: 398, peRatio: 15.8, divYield: 2.95, ytd: -2.8, m1: 0.9, m3: 2.1, m6: -1.3, y1: 3.2 },
      { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 28.92, marketCap: 163, peRatio: 10.2, divYield: 5.82, ytd: -12.4, m1: -3.1, m3: -8.2, m6: -10.8, y1: -18.9 },
      
      // Consumer
      { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 184.78, marketCap: 1930, peRatio: 43.2, divYield: 0.00, ytd: 27.8, m1: 3.4, m3: 9.8, m6: 21.3, y1: 38.9 },
      { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', price: 258.02, marketCap: 823, peRatio: 72.8, divYield: 0.00, ytd: -2.1, m1: 8.9, m3: -4.3, m6: -8.7, y1: 12.3 },
      { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', price: 78.42, marketCap: 631, peRatio: 32.8, divYield: 1.09, ytd: 52.8, m1: 4.2, m3: 14.8, m6: 32.1, y1: 58.9 },
      { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples', price: 172.34, marketCap: 402, peRatio: 27.8, divYield: 2.34, ytd: 18.9, m1: 1.2, m3: 5.8, m6: 12.3, y1: 22.8 },
      { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', price: 394.28, marketCap: 392, peRatio: 26.9, divYield: 2.27, ytd: 14.2, m1: 2.8, m3: 6.3, m6: 11.8, y1: 19.8 },
      { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer Staples', price: 901.23, marketCap: 399, peRatio: 53.2, divYield: 0.48, ytd: 48.9, m1: 5.3, m3: 16.2, m6: 31.8, y1: 62.3 },
      
      // Energy & Industrials
      { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', price: 118.34, marketCap: 521, peRatio: 13.8, divYield: 3.04, ytd: 18.2, m1: -1.8, m3: 4.2, m6: 12.8, y1: 14.3 },
      { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Energy', price: 147.89, marketCap: 268, peRatio: 14.2, divYield: 3.98, ytd: 8.3, m1: -3.2, m3: 1.8, m6: 6.9, y1: 2.1 },
      { ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', price: 384.92, marketCap: 192, peRatio: 16.8, divYield: 1.47, ytd: 32.8, m1: 4.8, m3: 12.3, m6: 24.8, y1: 48.9 },
      { ticker: 'BA', name: 'Boeing Company', sector: 'Industrials', price: 156.23, marketCap: 96, peRatio: 0.0, divYield: 0.00, ytd: -38.2, m1: -8.9, m3: -18.3, m6: -28.7, y1: -42.1 },
      
      // Others
      { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services', price: 93.54, marketCap: 169, peRatio: 38.9, divYield: 0.00, ytd: 12.8, m1: -0.8, m3: -2.1, m6: 8.3, y1: 18.9 },
      { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', price: 698.54, marketCap: 301, peRatio: 44.8, divYield: 0.00, ytd: 48.3, m1: 6.2, m3: 18.9, m6: 32.4, y1: 78.2 },
      { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 542.18, marketCap: 243, peRatio: 48.2, divYield: 0.00, ytd: -8.3, m1: -2.8, m3: -4.2, m6: -6.9, y1: 12.8 },
      { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 254.92, marketCap: 246, peRatio: 42.3, divYield: 0.00, ytd: -3.2, m1: 1.8, m3: -1.4, m6: -2.8, y1: 8.9 },
      { ticker: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', price: 168.34, marketCap: 464, peRatio: 38.9, divYield: 1.14, ytd: 48.2, m1: 8.3, m3: 21.8, m6: 34.2, y1: 62.8 }
    ];

    return companiesData.map(company => ({
      ticker: company.ticker,
      companyName: company.name,
      ytdReturn: company.ytd,
      oneMonthReturn: company.m1,
      threeMonthReturn: company.m3,
      sixMonthReturn: company.m6,
      oneYearReturn: company.y1,
      currentPrice: company.price,
      marketCap: company.marketCap,
      peRatio: company.peRatio,
      dividendYield: company.divYield,
      sector: company.sector
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual script data fetching
      // const scriptId = 'sp-members-rate-of-change'; // This should be the actual script ID
      // const response = await GetScriptByID({ id: scriptId });
      // const scriptData = parseScriptData(response.data);
      
      // For now, using mock data
      const mockData = generateMockData();
      setData(mockData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load S&P member data. Please try again later.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    let filtered = data;
    
    // Apply search filter
    if (searchTerm) {
      filtered = data.filter(item =>
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [data, searchTerm, sortField, sortDirection]);

  const formatPercent = (value: number) => {
    const formatted = value.toFixed(2);
    const className = value > 0 ? 'positive-value' : value < 0 ? 'negative-value' : 'neutral-value';
    return <span className={className}>{value > 0 ? '+' : ''}{formatted}%</span>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    return `${value.toFixed(0)}B`;
  };

  const exportToCSV = () => {
    const headers = [
      'Ticker', 'Company Name', 'Sector', 'YTD Return (%)', '1M Return (%)',
      '3M Return (%)', '6M Return (%)', '1Y Return (%)', 'Current Price',
      'Market Cap (B)', 'P/E Ratio', 'Dividend Yield (%)'
    ];
    
    const rows = sortedAndFilteredData.map(item => [
      item.ticker,
      item.companyName,
      item.sector,
      item.ytdReturn.toFixed(2),
      item.oneMonthReturn.toFixed(2),
      item.threeMonthReturn.toFixed(2),
      item.sixMonthReturn.toFixed(2),
      item.oneYearReturn.toFixed(2),
      item.currentPrice.toFixed(2),
      item.marketCap.toFixed(0),
      item.peRatio.toFixed(2),
      item.dividendYield.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sp500-returns-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSortClassName = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc';
    }
    return '';
  };

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const ytdReturns = data.map(d => d.ytdReturn);
    const avgReturn = ytdReturns.reduce((a, b) => a + b, 0) / ytdReturns.length;
    const positiveCount = ytdReturns.filter(r => r > 0).length;
    const negativeCount = ytdReturns.filter(r => r < 0).length;
    
    return {
      avgReturn,
      positiveCount,
      negativeCount,
      totalCount: data.length
    };
  }, [data]);

  if (loading) {
    return (
      <Container fluid className="sp-dashboard-container">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading S&P 500 member data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="sp-dashboard-container">
        <Alert variant="danger" className="error-message">
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadData}>
            <RefreshIcon style={{ fontSize: 16 }} className="me-1" /> Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="sp-dashboard-container">
      <div className="dashboard-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h2 className="page-title mb-0">S&P 500 Member Returns</h2>
            {lastUpdated && (
              <small className="text-muted">
                Last updated: {lastUpdated.toLocaleString()}
              </small>
            )}
          </Col>
          <Col xs="auto">
            <Button variant="outline-primary" size="sm" onClick={loadData}>
              <RefreshIcon style={{ fontSize: 16 }} className="me-1" /> Refresh
            </Button>
          </Col>
        </Row>
      </div>

      {stats && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-label">Average YTD Return</div>
            <div className="stat-value">{formatPercent(stats.avgReturn)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Positive Returns</div>
            <div className="stat-value positive-value">{stats.positiveCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Negative Returns</div>
            <div className="stat-value negative-value">{stats.negativeCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Companies</div>
            <div className="stat-value">{stats.totalCount}</div>
          </div>
        </div>
      )}

      {/* Top Banner Ad */}
      <div className="mb-4">
        <GoogleAdsense
          client="ca-pub-XXXXXXXXXXXXXXXX"
          slot="1234567890"
          format="horizontal"
          responsive={true}
          mockAd={true}
          style={{ display: 'block', minHeight: '90px', maxWidth: '100%' }}
        />
      </div>

      <div className="dashboard-controls">
        <Row className="align-items-center">
          <Col md={6}>
            <Form.Group className="search-bar">
              <Form.Control
                type="text"
                placeholder="Search by ticker, company name, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-3"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <Button variant="success" onClick={exportToCSV} className="export-button">
              <DownloadIcon style={{ fontSize: 16 }} className="me-1" /> Export CSV
            </Button>
          </Col>
        </Row>
      </div>

      <div className="data-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sortable-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('ticker')} className={getSortClassName('ticker')}>
                  Ticker <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('companyName')} className={getSortClassName('companyName')}>
                  Company <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('sector')} className={getSortClassName('sector')}>
                  Sector <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('ytdReturn')} className={getSortClassName('ytdReturn')}>
                  YTD Return <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('oneMonthReturn')} className={getSortClassName('oneMonthReturn')}>
                  1M <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('threeMonthReturn')} className={getSortClassName('threeMonthReturn')}>
                  3M <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('sixMonthReturn')} className={getSortClassName('sixMonthReturn')}>
                  6M <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('oneYearReturn')} className={getSortClassName('oneYearReturn')}>
                  1Y <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('currentPrice')} className={getSortClassName('currentPrice')}>
                  Price <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('marketCap')} className={getSortClassName('marketCap')}>
                  Market Cap <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('peRatio')} className={getSortClassName('peRatio')}>
                  P/E <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
                <th onClick={() => handleSort('dividendYield')} className={getSortClassName('dividendYield')}>
                  Div Yield <SwapVertIcon style={{ fontSize: 14 }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((item) => (
                <tr key={item.ticker}>
                  <td className="ticker-cell">{item.ticker}</td>
                  <td className="company-name">{item.companyName}</td>
                  <td>{item.sector}</td>
                  <td>{formatPercent(item.ytdReturn)}</td>
                  <td>{formatPercent(item.oneMonthReturn)}</td>
                  <td>{formatPercent(item.threeMonthReturn)}</td>
                  <td>{formatPercent(item.sixMonthReturn)}</td>
                  <td>{formatPercent(item.oneYearReturn)}</td>
                  <td>{formatCurrency(item.currentPrice)}</td>
                  <td>{formatMarketCap(item.marketCap)}</td>
                  <td>{item.peRatio.toFixed(2)}</td>
                  <td>{item.dividendYield.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedAndFilteredData.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No data found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Bottom Banner Ad */}
      <div className="mt-4">
        <GoogleAdsense
          client="ca-pub-XXXXXXXXXXXXXXXX"
          slot="9876543210"
          format="horizontal"
          responsive={true}
          mockAd={true}
          style={{ display: 'block', minHeight: '100px', maxWidth: '100%' }}
        />
      </div>
    </Container>
  );
};

export default SPMemberReturns;
