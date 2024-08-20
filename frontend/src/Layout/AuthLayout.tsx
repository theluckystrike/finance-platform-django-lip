import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
 


const AuthLayout: React.FC = () => {
  useEffect(() => {
    // Your useEffect code here
  }, []);

  return (
    <div>
 
      <div>
            <Outlet />
      </div>
 
    </div>
  );
};

export default AuthLayout;
