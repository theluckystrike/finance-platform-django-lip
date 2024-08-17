import SimpleLayout from "../Layout/SimpleLayout";
import  Home  from "../pages/Home/Home";
 

 
  
 export const SimpleRoute = [
    {
      path: "/account",
      element: <SimpleLayout/>,
      children: [
        {
          path: "home",
          element: <Home/>,
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