import React, { Suspense, lazy } from "react";
import AuthGuard from "../Layout/AuthGuard";
import AuthLayout from "../Layout/AuthLayout";
import { ActiveRoute, SidebarMenu } from "../Menu";
import CategoryManger from "../pages/UploadScript/CategoryManger";

// Lazy load the components
const CustomReport = lazy(() => import("../pages/AllScript/AllScript"));
const ScriptEdit = lazy(() => import("../pages/AllScript/Script_Edit"));
const ScriptView = lazy(() => import("../pages/AllScript/Script_view"));
const Home = lazy(() => import("../pages/Home/Home"));
const ReportView = lazy(() => import("../pages/Reports/Report_view"));
const Report = lazy(() => import("../pages/Reports/Reports"));
const UploadScript = lazy(() => import("../pages/UploadScript/UploadScript"));

export const SimpleRoute = [
  {
    path: "/account",
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
        path: SidebarMenu.Report.path,
        element: <Report />,
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
    ],
  },
];
