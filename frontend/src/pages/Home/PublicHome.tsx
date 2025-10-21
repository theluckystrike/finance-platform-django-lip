import React, { useState } from 'react';
import { Container, Tab, Tabs, Row, Col, Card, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IndexComparisonTable from '../Dashboard/IndexComparisonTable';
import { useLoginMutation } from '../../Redux/AuthSlice';
import useToast from '../../customHook/toast';
import { SidebarMenu } from '../../Menu';
import '../Dashboard/Dashboard.css';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('market-returns');
  const [login, { isLoading }] = useLoginMutation();
  const handleToast = useToast();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await login(values).unwrap();
        localStorage.setItem('login', JSON.stringify(result));
        handleToast.SuccessToast('Logged in successfully');
        navigate(`/${SidebarMenu.upload.path}`);
      } catch (error) {
        handleToast.ErrorToast('Login failed. Please check your credentials.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container fluid className="px-4 py-4">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="page-title" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
          US Stock Market Analytics
        </h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Comprehensive market data, index performance, and investment research tools
        </p>
      </div>

      {/* Tabbed Navigation */}
      <Tabs
        id="public-home-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'market-returns')}
        className="mb-4"
        style={{
          borderBottom: '2px solid #e5e7eb',
          fontWeight: 600
        }}
      >
        {/* US Stock Market Returns Tab */}
        <Tab
          eventKey="market-returns"
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUpIcon style={{ fontSize: 20 }} />
              US Stock Market Returns
            </span>
          }
        >
          <div className="pt-4">
            <div className="mb-4">
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
                Major Index Performance
              </h3>
              <p className="text-muted" style={{ fontSize: '14px' }}>
                Compare performance across the leading US stock market indices. Click any ticker to view
                detailed member-level returns and analytics.
              </p>
            </div>

            <IndexComparisonTable />
          </div>
        </Tab>

        {/* User Portal Tab */}
        <Tab
          eventKey="user-portal"
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AccountCircleIcon style={{ fontSize: 20 }} />
              User Portal
            </span>
          }
        >
          <div className="pt-4">
            <Row className="justify-content-center">
              <Col lg={10} xl={8}>
                <Row className="g-4">
                  {/* Login Section */}
                  <Col md={6}>
                    <Card className="shadow-sm h-100">
                      <Card.Body className="p-4">
                        <div className="text-center mb-4">
                          <AccountCircleIcon style={{ fontSize: 48, color: '#3b82f6' }} />
                          <h4 className="mt-3 mb-2" style={{ fontWeight: 600 }}>
                            Sign In
                          </h4>
                          <p className="text-muted" style={{ fontSize: '14px' }}>
                            Access your portfolio and research tools
                          </p>
                        </div>

                        <form onSubmit={formik.handleSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500, fontSize: '14px' }}>
                              Username
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="username"
                              placeholder="Enter your username"
                              value={formik.values.username}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.username && !!formik.errors.username
                              }
                              style={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '14px'
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.username}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500, fontSize: '14px' }}>
                              Password
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder="Enter your password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.password && !!formik.errors.password
                              }
                              style={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '14px'
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.password}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              name="rememberMe"
                              label="Remember me"
                              checked={formik.values.rememberMe}
                              onChange={formik.handleChange}
                              style={{ fontSize: '14px' }}
                            />
                          </Form.Group>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <a
                              href="#"
                              style={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                fontSize: '14px'
                              }}
                            >
                              Forgot password?
                            </a>
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={isLoading || formik.isSubmitting}
                            style={{
                              borderRadius: '8px',
                              padding: '12px',
                              fontWeight: 600,
                              fontSize: '14px'
                            }}
                          >
                            {isLoading || formik.isSubmitting ? 'Signing in...' : 'Sign In'}
                          </Button>
                        </form>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Sign Up Section */}
                  <Col md={6}>
                    <Card className="shadow-sm h-100" style={{ backgroundColor: '#f9fafb' }}>
                      <Card.Body className="p-4 d-flex flex-column">
                        <div className="text-center mb-4">
                          <AccountCircleIcon style={{ fontSize: 48, color: '#6b7280' }} />
                          <h4 className="mt-3 mb-2" style={{ fontWeight: 600 }}>
                            Create Account
                          </h4>
                          <p className="text-muted" style={{ fontSize: '14px' }}>
                            Join our platform for exclusive features
                          </p>
                        </div>

                        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center py-4">
                          <div className="mb-4">
                            <div
                              style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginBottom: '16px'
                              }}
                            >
                              <span style={{ fontSize: '32px' }}>🚀</span>
                            </div>
                            <h5 style={{ fontWeight: 600, marginBottom: '12px' }}>
                              Coming Soon
                            </h5>
                            <p className="text-muted mb-4" style={{ fontSize: '14px', maxWidth: '300px' }}>
                              Please check back for more information about account registration
                              and premium features.
                            </p>
                          </div>

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                Registration is not yet available. Please check back soon!
                              </Tooltip>
                            }
                          >
                            <div style={{ width: '100%' }}>
                              <Button
                                variant="outline-secondary"
                                className="w-100"
                                disabled
                                style={{
                                  borderRadius: '8px',
                                  padding: '12px',
                                  fontWeight: 600,
                                  fontSize: '14px'
                                }}
                              >
                                Sign Up (Coming Soon)
                              </Button>
                            </div>
                          </OverlayTrigger>
                        </div>

                        <div className="mt-auto pt-4 border-top">
                          <small className="text-muted d-block text-center" style={{ fontSize: '12px' }}>
                            Want to be notified when registration opens?
                            <br />
                            Contact us for early access.
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Additional Info */}
                <div className="mt-4 p-4 bg-light rounded">
                  <h6 className="mb-2" style={{ fontWeight: 600 }}>
                    Why Create an Account?
                  </h6>
                  <Row className="g-3">
                    <Col md={6}>
                      <ul className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                        <li>Access advanced portfolio analytics</li>
                        <li>Custom watchlists and alerts</li>
                        <li>Historical performance tracking</li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <ul className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                        <li>Personalized market insights</li>
                        <li>Export custom reports</li>
                        <li>Priority support access</li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PublicHome;

