import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '../Layout/PublicLayout';

const PublicHome = lazy(() => import('../pages/Home/PublicHome'));
const DashboardList = lazy(() => import('../pages/Dashboard/DashboardList'));
const SPMemberReturns = lazy(() => import('../pages/Dashboard/SPMemberReturns'));
const SP500Dashboard = lazy(() => import('../pages/Dashboard/SP500Dashboard'));

// Public routes that don't require authentication
export const PublicRoutes = [
  {
    path: '/public',
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PublicHome />
          </Suspense>
        ),
      },
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
        path: 'dashboard/sp500',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SP500Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/nasdaq100',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SPMemberReturns />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/djia',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SPMemberReturns />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/russell2000',
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
    ],
  },
];
