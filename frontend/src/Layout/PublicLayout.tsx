import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import BarChartIcon from '@mui/icons-material/BarChart';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import GoogleAdsense from '../Comopnent/GoogleAds/GoogleAdsense';
import GoogleAdsConfig from '../Comopnent/GoogleAds/GoogleAdsConfig';

const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="public-layout">
      {/* Initialize Google AdSense - Replace with your actual publisher ID */}
      <GoogleAdsConfig publisherId="ca-pub-XXXXXXXXXXXXXXXX" />
      
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/public/dashboard" className="d-flex align-items-center">
            <BarChartIcon style={{ fontSize: 24 }} className="me-2" />
            <span className="fw-bold">Market Dashboards</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="public-navbar" />
          
          <Navbar.Collapse id="public-navbar">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/public/dashboard"
                active={location.pathname === '/public/dashboard'}
              >
                <HomeIcon style={{ fontSize: 18 }} className="me-1" />
                All Dashboards
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/public/dashboard/sp-member-returns"
                active={location.pathname === '/public/dashboard/sp-member-returns'}
              >
                S&P 500 Returns
              </Nav.Link>
            </Nav>
            
            <Nav>
              <Link to="/login" className="text-decoration-none">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  className="ms-2"
                >
                  <LoginIcon style={{ fontSize: 18 }} className="me-1" />
                  Login for Full Access
                </Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="public-content">
        <Outlet />
      </div>

      {/* Google AdSense Container */}
      <div className="google-ads-container">
        <Container fluid className="px-4 py-3">
          <div className="ad-banner bg-light border rounded p-3 text-center">
            {/* Replace these values with your actual AdSense client ID and slot ID */}
            <GoogleAdsense
              client="ca-pub-XXXXXXXXXXXXXXXX"
              slot="1234567890"
              format="auto"
              responsive={true}
              style={{ display: 'block', minHeight: '90px' }}
            />
          </div>
        </Container>
      </div>

      <footer className="bg-dark text-light py-3 mt-5">
        <Container>
          <div className="text-center">
            <small>© 2024 Market Dashboards. Public data for informational purposes only.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
