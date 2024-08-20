import SimpleLayout from "../Layout/SimpleLayout";
import { ActiveRoute, SidebarMenu } from "../Menu";
import CustomReport from "../pages/AllScript/AllScript";
import  Home  from "../pages/Home/Home";
import ReportViwe from "../pages/Reports/Report_view";
import Report from "../pages/Reports/Reports";
import UploadScript from "../pages/UploadScript/UploadScript";
 

 
  
 export const SimpleRoute = [
    {
      path: "/account",
      element: <SimpleLayout/>,
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