import React, { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import GoogleAdsense from '../../Comopnent/GoogleAds/GoogleAdsense';
import './Dashboard.css';

interface SP500Data {
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

type SortField = keyof SP500Data;
type SortDirection = 'asc' | 'desc';

const SP500Dashboard: React.FC = () => {
  const [data, setData] = useState<SP500Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('ytdReturn');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with your logic
      // This is a placeholder - waiting for your logic implementation
      
      // For now, showing empty state
      setData([]);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load S&P 500 data. Please try again later.');
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
        <div className="loading-spinner text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading S&P 500 data...</p>
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
            <h2 className="page-title mb-0">S&P 500</h2>
            <p className="text-muted">Track S&P 500 member performance and returns</p>
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
        <div className="stats-cards mb-4">
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
            <Button 
              variant="success" 
              onClick={exportToCSV} 
              className="export-button"
              disabled={data.length === 0}
            >
              <DownloadIcon style={{ fontSize: 16 }} className="me-1" /> Export CSV
            </Button>
          </Col>
        </Row>
      </div>

      <div className="data-table-container">
        {data.length === 0 ? (
          <div className="text-center py-5">
            <Alert variant="info">
              <h5>S&P 500 Dashboard Ready</h5>
              <p className="mb-0">Waiting for data logic implementation. This dashboard is ready to display S&P 500 member performance once connected to the data source.</p>
            </Alert>
          </div>
        ) : (
          <>
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
          </>
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

export default SP500Dashboard;

