import React from "react";
import { Outlet } from "react-router-dom";

const SimpleLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default SimpleLayout;
