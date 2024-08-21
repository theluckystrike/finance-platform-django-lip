import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
 


const SimpleLayout: React.FC = () => {
  useEffect(() => {
    // Your useEffect code here
  }, []);

  return (
    <div>
            <Outlet />
    </div>
  );
};

export default SimpleLayout;
