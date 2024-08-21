// src/Routes/AuthRoutes.tsx
import React from 'react';
import SimpleLayout from '../Layout/SimpleLayout';
import { AuthMenu } from '../Menu';
import AuthLogin from '../pages/Auth/AuthLogin';
import { AppRoute } from '../types/RouteTypes';
 
// Import other components and routes as needed

export const AuthRoute: AppRoute[] = [
  {
    path: '/',
    element: <SimpleLayout />,
    children: [
      {
        path: AuthMenu.login.path,
        element: <AuthLogin />,
      },
      // Example of a protected route:
      // {
      //   path: 'profile',
      //   element: (
      //     <ProtectedRoutes>
      //       <Profile />
      //     </ProtectedRoutes>
      //   ),
      // },
    ],
  },
];
