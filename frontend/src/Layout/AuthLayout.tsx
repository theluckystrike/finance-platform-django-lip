import React, { Suspense, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import SimpleHeader from '../Comopnent/Header/SimpleHeader';
import SimpleFooter from '../Comopnent/Footer/SimpleFooter';
import Sidebar from '../Comopnent/Sidebar/Sidebar';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { loading } = useSelector((i: any) => i?.script);

  return (
    <div className="row m-0 p-0">
      <div className="col-md-2 d-md-flex d-none p-0 ">
        <Sidebar />
      </div>
      <div className="col-sm-12 col-md-10 vh-100 overflow-auto p-0">
        <div className="header-fixed">
          <SimpleHeader />
        </div>
        <div className="content_main_wrap">
          <Suspense
            fallback={
              <div className="loader-center">
                {' '}
                <div className="  spinner-border text-dark" role="status"></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
        <div>
          <SimpleFooter />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
