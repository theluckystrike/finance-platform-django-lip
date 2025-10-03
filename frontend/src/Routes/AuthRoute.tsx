import React, { lazy } from 'react';
import AuthGuard from '../Layout/AuthGuard';
import AuthLayout from '../Layout/AuthLayout';
import { ActiveRoute, SidebarMenu } from '../Menu';

// Lazy load the components
const CustomReport = lazy(() => import('../pages/AllScript/AllScript'));
const FilterPAge = lazy(() => import('../pages/AllScript/FilterScripts'));
const ScriptEdit = lazy(() => import('../pages/AllScript/Script_Edit'));
const ScriptView = lazy(() => import('../pages/AllScript/Script_view'));
const Home = lazy(() => import('../pages/Home/Home'));
const ReportView = lazy(() => import('../pages/Reports/Report_view'));
const Report = lazy(() => import('../pages/Reports/Reports'));
const TapeSummary = lazy(() => import('../pages/model-summary/model-summary'));
const CreateSummary = lazy(
  () => import('../pages/model-summary/CreateSummary'),
);
const TapeSummaryResult = lazy(
  () => import('../pages/model-summary/model-summary-result'),
);
const UploadScript = lazy(() => import('../pages/UploadScript/UploadScript'));
const CategoryManger = lazy(
  () => import('../pages/UploadScript/CategoryManger'),
);
const ErrorHandling = lazy(() => import('../pages/ErrorHandling/ErrorHandle'));
const Profile = lazy(() => import('../pages/user/Profile'));
const ScriptTree = lazy(() => import('../pages/AllScript/ScriptTree'));
const DashboardList = lazy(() => import('../pages/Dashboard/DashboardList'));
const SPMemberReturns = lazy(() => import('../pages/Dashboard/SPMemberReturns'));
const SP500Dashboard = lazy(() => import('../pages/Dashboard/SP500Dashboard'));

export const SimpleRoute = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <AuthLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: SidebarMenu.home.path,
        element: <Home />,
      },
      {
        path: SidebarMenu.upload.path,
        element: <UploadScript />,
      },
      {
        path: SidebarMenu.Allscripts.path,
        element: <CustomReport />,
      },
      {
        path: SidebarMenu.Filterscripts.path,
        element: <FilterPAge />,
      },
      {
        path: SidebarMenu.Report.path,
        element: <Report />,
      },
      {
        path: SidebarMenu.tapesummary.path,
        element: <TapeSummary />,
      },
      {
        path: SidebarMenu.dashboard.path,
        element: <DashboardList />,
      },
      {
        path: 'dashboard/sp-member-returns',
        element: <SPMemberReturns />,
      },
      {
        path: 'dashboard/sp500',
        element: <SP500Dashboard />,
      },
      {
        path: 'dashboard/:dashboardId',
        element: <SPMemberReturns />, // Will route to appropriate dashboard based on ID
      },
      {
        path: ActiveRoute.ReportDetails.path,
        element: <ReportView />,
      },
      {
        path: ActiveRoute.ScriptDetails.path,
        element: <ScriptView />,
      },
      {
        path: ActiveRoute.ScriptEdit.path,
        element: <ScriptEdit />,
      },
      {
        path: ActiveRoute.CategoryManager.path,
        element: <CategoryManger />,
      },
      {
        path: ActiveRoute.CreateSummary.path,
        element: <CreateSummary />,
      },
      {
        path: ActiveRoute.TapeSummaryResult.path,
        element: <TapeSummaryResult />,
      },
      {
        path: SidebarMenu.errorhandling.path,
        element: <ErrorHandling />,
      },
      {
        path: ActiveRoute.UserProfile.path,
        element: <Profile />,
      },
      {
        path: SidebarMenu.scriptTree.path,
        element: <ScriptTree />,
      },
    ],
  },
];
