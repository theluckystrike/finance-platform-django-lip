import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { SidebarAd, InFeedAd } from '../../Comopnent/GoogleAds/MockAds';
import './Dashboard.css';

interface Dashboard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isPublic: boolean;
  lastUpdated?: string;
  dataSource?: string;
}

const DashboardList: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: 'sp-member-returns',
      name: 'S&P Member Returns',
      description: 'Track S&P 500 member performance with YTD returns, sortable by multiple metrics',
      icon: <TrendingUpIcon style={{ fontSize: 32 }} />,
      isPublic: true,
      lastUpdated: new Date().toISOString(),
      dataSource: 'S&P Members Rate of Change Script'
    },
    {
      id: 'market-overview',
      name: 'Market Overview',
      description: 'Real-time market indices, sector performance, and key indicators',
      icon: <BarChartIcon style={{ fontSize: 32 }} />,
      isPublic: true,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Multiple market data sources'
    },
    {
      id: 'sector-analysis',
      name: 'Sector Analysis',
      description: 'Detailed sector rotation analysis and performance metrics',
      icon: <PieChartIcon style={{ fontSize: 32 }} />,
      isPublic: true,
      lastUpdated: new Date().toISOString(),
      dataSource: 'BlackRock Index Data'
    },
    {
      id: 'volatility-tracker',
      name: 'Volatility Tracker',
      description: 'Track market volatility indicators and risk metrics',
      icon: <ShowChartIcon style={{ fontSize: 32 }} />,
      isPublic: true,
      lastUpdated: new Date().toISOString(),
      dataSource: 'VIX and options data'
    }
  ]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container fluid className="dashboard-list-container px-4 py-4">
      <div className="dashboard-header mb-4">
        <h2 className="page-title">Market Dashboards</h2>
        <p className="text-muted">
          Select a dashboard to view real-time market data and analytics
        </p>
      </div>

      <Row className="g-4">
        {/* Main content column */}
        <Col lg={9}>
          <Row className="g-4">
            {dashboards.map((dashboard, index) => (
              <React.Fragment key={dashboard.id}>
                <Col xs={12} md={6} lg={6} xl={4}>
                  <Link 
                    to={`/dashboard/${dashboard.id}`} 
                    className="text-decoration-none"
                  >
                    <Card className="dashboard-card h-100 shadow-sm hover-shadow">
                      <Card.Body className="d-flex flex-column">
                        <div className="dashboard-icon-wrapper mb-3">
                          <div className="dashboard-icon">
                            {dashboard.icon}
                          </div>
                          {dashboard.isPublic && (
                            <Badge bg="success" className="ms-auto">
                              Public
                            </Badge>
                          )}
                        </div>
                        
                        <h5 className="dashboard-card-title mb-2">
                          {dashboard.name}
                        </h5>
                        
                        <p className="dashboard-card-description text-muted mb-3 flex-grow-1">
                          {dashboard.description}
                        </p>
                        
                        <div className="dashboard-meta">
                          <small className="text-muted d-block">
                            <strong>Data Source:</strong> {dashboard.dataSource}
                          </small>
                          <small className="text-muted">
                            <strong>Last Updated:</strong> {formatDate(dashboard.lastUpdated)}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                {/* Insert in-feed ad after second dashboard */}
                {index === 1 && (
                  <Col xs={12}>
                    <InFeedAd />
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
        </Col>
        
        {/* Sidebar with ads */}
        <Col lg={3}>
          <div className="sticky-top" style={{ top: '20px' }}>
            <h5 className="mb-3">Sponsored Content</h5>
            <SidebarAd />
            <SidebarAd />
            <SidebarAd />
          </div>
        </Col>
      </Row>

      <div className="dashboard-info-section mt-5 p-4 bg-light rounded">
        <h4>About Market Dashboards</h4>
        <p className="mb-2">
          Our market dashboards provide real-time insights and analytics for various market segments.
          All dashboards are updated automatically with the latest market data.
        </p>
        <ul className="mb-0">
          <li>Sortable columns for easy data analysis</li>
          <li>Real-time data updates from multiple sources</li>
          <li>Export capabilities for further analysis</li>
          <li>Mobile-responsive design for on-the-go access</li>
        </ul>
      </div>
    </Container>
  );
};

export default DashboardList;
