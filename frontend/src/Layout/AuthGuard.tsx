import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }:any) => {
  const Auth:any = JSON.parse(localStorage.getItem('login') as any)  
  const isAuthenticated =Auth? true:false // Replace with your actual authentication check logic
//   const isAuthenticated = checkAuthentication(); // Replace with your actual authentication check logic

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to the login page or any other route
  }

  return children;
};

export default AuthGuard;
