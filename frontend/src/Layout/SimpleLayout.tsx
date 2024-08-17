import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";

import SimpleHeader from "../Comopnent/Header/SimpleHeader";
import SimpleFooter from "../Comopnent/Footer/SimpleFooter";
import Sidebar from "../Comopnent/Sidebar/Sidebar";

const SimpleLayout = () => {
  useEffect(() => {
    // Your useEffect code here
  }, []);

  return (
    <div className="row">
		  <div className="col-2 p-0 ">
			  <Sidebar/>

	  </div>
      <div className="col-10 p-0">
        <div className="header-fixed">
          <SimpleHeader />
        </div>
        <div className=" content_main_wrap">
          <Outlet />
        </div>

        <div>
          <SimpleFooter />
        </div>
      </div>
    </div>
  );
};

export default SimpleLayout;
