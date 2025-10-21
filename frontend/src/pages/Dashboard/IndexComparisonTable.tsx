import React, { useState, useMemo } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SearchIcon from '@mui/icons-material/Search';
import './Dashboard.css';

interface IndexData {
  indexName: string;
  ticker: string;
  marketCap: string;
  ytdReturn: number;
  oneMonthReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  oneYearReturn: number;
  linkPath: string;
}

type SortField = keyof Omit<IndexData, 'indexName' | 'ticker' | 'marketCap' | 'linkPath'>;
type SortDirection = 'asc' | 'desc';

const IndexComparisonTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('ytdReturn');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Mock data for 4 major indices - will be replaced with API data
  const indexData: IndexData[] = [
    {
      indexName: 'S&P 500',
      ticker: '^GSPC',
      marketCap: '$45.5T',
      ytdReturn: 24.8,
      oneMonthReturn: 2.1,
      threeMonthReturn: 8.4,
      sixMonthReturn: 15.2,
      oneYearReturn: 28.6,
      linkPath: '/public/dashboard/sp500'
    },
    {
      indexName: 'NASDAQ-100',
      ticker: '^NDX',
      marketCap: '$20.2T',
      ytdReturn: 38.2,
      oneMonthReturn: 3.5,
      threeMonthReturn: 12.1,
      sixMonthReturn: 22.8,
      oneYearReturn: 45.3,
      linkPath: '/public/dashboard/nasdaq100'
    },
    {
      indexName: 'Dow Jones Industrial Average',
      ticker: '^DJI',
      marketCap: '$11.8T',
      ytdReturn: 16.4,
      oneMonthReturn: 1.8,
      threeMonthReturn: 6.2,
      sixMonthReturn: 12.1,
      oneYearReturn: 19.7,
      linkPath: '/public/dashboard/djia'
    },
    {
      indexName: 'Russell 2000',
      ticker: '^RUT',
      marketCap: '$3.2T',
      ytdReturn: 12.3,
      oneMonthReturn: -0.5,
      threeMonthReturn: 4.8,
      sixMonthReturn: 9.2,
      oneYearReturn: 15.8,
      linkPath: '/public/dashboard/russell2000'
    }
  ];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return indexData;
    const lowerSearch = searchTerm.toLowerCase();
    return indexData.filter(
      (index) =>
        index.indexName.toLowerCase().includes(lowerSearch) ||
        index.ticker.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatReturn = (value: number) => {
    const color = value >= 0 ? '#10b981' : '#ef4444';
    const sign = value >= 0 ? '+' : '';
    return (
      <span style={{ color, fontWeight: 600 }}>
        {sign}{value.toFixed(2)}%
      </span>
    );
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <SwapVertIcon style={{ fontSize: 18, opacity: 0.3 }} />;
    }
    return (
      <SwapVertIcon
        style={{
          fontSize: 18,
          transform: sortDirection === 'asc' ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s'
        }}
      />
    );
  };

  return (
    <Container fluid className="px-0">
      {/* Search Bar */}
      <div className="mb-4">
        <Form.Group className="position-relative">
          <SearchIcon
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: 20
            }}
          />
          <Form.Control
            type="text"
            placeholder="Search by index name or ticker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '40px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px'
            }}
          />
        </Form.Group>
      </div>

      {/* Index Comparison Table */}
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <Table hover className="align-middle" style={{ minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <tr>
              <th style={{ fontWeight: 600, color: '#374151', padding: '16px' }}>
                Index Name
              </th>
              <th style={{ fontWeight: 600, color: '#374151', padding: '16px' }}>
                Ticker
              </th>
              <th style={{ fontWeight: 600, color: '#374151', padding: '16px' }}>
                Market Cap
              </th>
              <th
                onClick={() => handleSort('ytdReturn')}
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  padding: '16px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                YTD {getSortIcon('ytdReturn')}
              </th>
              <th
                onClick={() => handleSort('oneMonthReturn')}
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  padding: '16px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                1M {getSortIcon('oneMonthReturn')}
              </th>
              <th
                onClick={() => handleSort('threeMonthReturn')}
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  padding: '16px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                3M {getSortIcon('threeMonthReturn')}
              </th>
              <th
                onClick={() => handleSort('sixMonthReturn')}
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  padding: '16px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                6M {getSortIcon('sixMonthReturn')}
              </th>
              <th
                onClick={() => handleSort('oneYearReturn')}
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  padding: '16px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                1Y {getSortIcon('oneYearReturn')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((index) => (
              <tr
                key={index.ticker}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s'
                }}
              >
                <td style={{ padding: '16px', fontWeight: 500 }}>
                  {index.indexName}
                </td>
                <td style={{ padding: '16px' }}>
                  <Link
                    to={index.linkPath}
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {index.ticker}
                  </Link>
                </td>
                <td style={{ padding: '16px', color: '#6b7280' }}>
                  {index.marketCap}
                </td>
                <td style={{ padding: '16px' }}>{formatReturn(index.ytdReturn)}</td>
                <td style={{ padding: '16px' }}>{formatReturn(index.oneMonthReturn)}</td>
                <td style={{ padding: '16px' }}>{formatReturn(index.threeMonthReturn)}</td>
                <td style={{ padding: '16px' }}>{formatReturn(index.sixMonthReturn)}</td>
                <td style={{ padding: '16px' }}>{formatReturn(index.oneYearReturn)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No indices found matching your search.</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-4 p-4 bg-light rounded">
        <h6 className="mb-2" style={{ fontWeight: 600 }}>About Index Returns</h6>
        <p className="mb-2 text-muted" style={{ fontSize: '14px' }}>
          This table displays performance metrics for major US stock market indices.
          Click on any ticker symbol to view detailed member-level returns and analysis.
        </p>
        <ul className="mb-0 text-muted" style={{ fontSize: '14px' }}>
          <li>Returns are calculated from daily closing prices</li>
          <li>Click column headers to sort by that metric</li>
          <li>Market cap values are approximate total market capitalization</li>
          <li>Data updated daily from automated collection scripts</li>
        </ul>
      </div>
    </Container>
  );
};

export default IndexComparisonTable;

