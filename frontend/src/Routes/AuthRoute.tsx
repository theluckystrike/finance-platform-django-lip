import AuthGuard from "../Layout/AuthGuard";
import AuthLayout from "../Layout/AuthLayout";
import { ActiveRoute, SidebarMenu } from "../Menu";
import CustomReport from "../pages/AllScript/AllScript";
import ScriptView from "../pages/AllScript/Script_view";
import  Home  from "../pages/Home/Home";
import ReportViwe from "../pages/Reports/Report_view";
import Report from "../pages/Reports/Reports";
import UploadScript from "../pages/UploadScript/UploadScript";
 

 
  
 export const SimpleRoute = [
    {
      path: "/account",
      element: (
      <AuthGuard>
        <AuthLayout/>
      </AuthGuard>
    ),
      children: [
        {
          path: SidebarMenu.home.path,
          element: <Home/>,
        },
        {
          path: SidebarMenu.upload.path,
          element: <UploadScript/>,
        },
        {
          path: SidebarMenu.Allscripts.path,
          element: <CustomReport/>,
        },
        {
          path: SidebarMenu.Report.path,
          element: <Report/>,
        },
        {
          path: ActiveRoute.ReportDetails.path,
          element: <ReportViwe/>,
        },
        {
          path: ActiveRoute.ScriptDetails.path,
          element: <ScriptView/>,
        },
        // {
        //     path: 'profile',
        //     element: (
        //       <ProtectedRoutes>
        //         <Profile />
        //       </ProtectedRoutes>
        //     ),
        //   },
         

  
      ],
    
    },

  ];