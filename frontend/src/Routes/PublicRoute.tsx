import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '../Layout/PublicLayout';

const DashboardList = lazy(() => import('../pages/Dashboard/DashboardList'));
const SPMemberReturns = lazy(() => import('../pages/Dashboard/SPMemberReturns'));

// Public routes that don't require authentication
export const PublicRoutes = [
  {
    path: '/public',
    element: <PublicLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardList />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/sp-member-returns',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SPMemberReturns />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/:dashboardId',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SPMemberReturns />
          </Suspense>
        ),
      },
      {
        path: '',
        element: <Navigate to="/public/dashboard" replace />,
      },
    ],
  },
];
