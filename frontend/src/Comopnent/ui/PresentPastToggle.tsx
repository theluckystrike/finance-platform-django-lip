import React, { useState } from "react";

const PresentPastToggle = () => {
  const [active, setActive] = useState("present");

  const handleClick = (value: string) => {
    setActive(value);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-12 col-md-3 col- row text-center position-relative">
        <span
          onClick={() => handleClick("present")}
          className={`toggle-item ${
            active === "present" ? "active" : ""
          } col-6`}
        >
          <h5> Present</h5>
        </span>
        <span
          onClick={() => handleClick("past")}
          className={`toggle-item ${active === "past" ? "active" : ""} col-6`}
        >
          <h5>Past</h5>
        </span>
        <div
          className="slider"
          style={{
            transform: `translateX(${active === "present" ? "78%" : "220%"})`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default PresentPastToggle;
