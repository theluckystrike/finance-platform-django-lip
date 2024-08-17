import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SimpleHeader from '../Comopnent/Header/SimpleHeader';
import SimpleFooter from '../Comopnent/Footer/SimpleFooter';


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
