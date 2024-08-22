import React, { useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import FilterModal from "../../Comopnent/ui/Modals/FilterModal/FilterModal";
import { ActiveRoute } from "../../Menu";
import SaveModal from "../../Comopnent/ui/Modals/SaveModal/SaveModal";

const CustomReport = () => {
  const [selectedScripts, setSelectedScripts] = useState([]);

  const data = [
    {
      title: "S&P 500 While NASDAQ AND DJIA Decline",
      category1: "Tape",
      category2: "Relative Strength",
      category3: "RS",
      startDate: "08/18/24",
      endDate: "08/20/24",
      startTime: "18:52",
      endTime: "10:03",
      chart: "LineChart",
    },
    {
      title: "Canada 2Yr - 5Yr vs. 5Yr - 10Yr Regression",
      category1: "Bonds",
      category2: "CAD Bonds",
      category3: "Regression-CAD",
      startDate: "11/18/23",
      endDate: "08/20/24",
      startTime: "17:39",
      endTime: "10:03",
      chart: "ScatterLineChart",
    },
    {
      title: "Factor Returns Table",
      category1: "Tape",
      category2: "Returns",
      category3: "Returns-Current",
      startDate: "04/16/24",
      endDate: "08/20/24",
      startTime: "18:47",
      endTime: "10:03",
      chart: "LineChart",
    },
    {
      title: "Philly and empire fed prices paid vs cpi",
      category1: "Monetary",
      category2: "Inflation",
      category3: "Inflation-Models",
      startDate: "11/16/23",
      endDate: "08/20/24",
      startTime: "22:56",
      endTime: "10:03",
      chart: "LineChart",
    },
    {
      title: "World Market ETFs Members 20pct 52WK High",
      category1: "Tape",
      category2: "Breadth",
      category3: "Participation/Disperson",
      startDate: "05/23/24",
      endDate: "08/20/24",
      startTime: "20:34",
      endTime: "10:03",
      chart: "LineChart",
    },
    {
      title: "U.S. 2y5y Fixed Income",
      category1: "Bonds",
      category2: "USD Bonds",
      category3: "Summary-USD",
      startDate: "01/19/24",
      endDate: "08/20/24",
      startTime: "12:47",
      endTime: "10:04",
      chart: "LineChart",
    },
    {
      title: "Continued Jobless Claims",
      category1: "Econ",
      category2: "Labour",
      category3: "Labour-Models",
      startDate: "08/08/24",
      endDate: "08/20/24",
      startTime: "19:44",
      endTime: "10:03",
      chart: "LineChart",
    },
  ];

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const [Saveshow, setSaveShow] = useState(false);
  const handleSaveClose = () => setSaveShow(false);
  const handleSaveShow = () => {
    setSaveShow(true);
  };

  const toggleSelectAll = (event: any) => {
    const checkboxes = document.querySelectorAll(
      '#scriptsCheckboxes input[type="checkbox"]'
    );
    checkboxes.forEach(
      (checkbox: any) => (checkbox.checked = event.target.checked)
    );
    handleCheckboxChange();
  };

  const handleCheckboxChange = () => {
    const selected: any = Array.from(
      document.querySelectorAll(
        '#scriptsCheckboxes input[type="checkbox"]:checked'
      )
    ).map((checkbox: any) => checkbox.value);
    setSelectedScripts(selected);
  };

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1">
            All scripts <span id="headerInfo">(132)</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button type="button" className="btn icon-button my-1 mx-2">
              <Icon icon="AddBusiness" size="20px" />
              <span>Add Home</span>
            </button>
            <button onClick={handleShow} className="btn icon-button my-1 mx-2">
              <Icon icon="Filter" size="20px" />
              <span>Filter</span>
            </button>
            <button onClick={handleSaveShow} type="button" className="btn icon-button my-1 mx-2">
              <Icon icon="Save" size="20px" />

              <span>Save</span>
            </button>
            <button
              type="submit"
              form="customReportForm"
              className="btn icon-button my-1 mx-2 disabled"
            >
              <Icon icon="Download" size="20px" />

              <span>Download</span>
            </button>
          </div>
        </div>
        <div>
          {132 > -1 ? (
            <form method="post" id="customReportForm">
              <div className="row mb-2 p-2 fw-bold w-100">
                <div className="col-5">
                  <h5>
                    <input
                      type="checkbox"
                      id="selectAllCheckbox"
                      onChange={toggleSelectAll}
                    />{" "}
                    Name
                  </h5>
                </div>
                <div className="col-1 mx-auto text-center">Category</div>
                <div className="col-2 mx-auto text-center">Sub Category 1</div>
                <div className="col-2 mx-auto text-center">Sub Category 2</div>
                <div className="col-1 mx-auto text-center">Created</div>
                <div className="col-1 mx-auto text-center">Last updated</div>
              </div>
              <div id="scriptsCheckboxes">
                {data.map((script: any) => (
                  <a
                    href={`/account/${ActiveRoute.ScriptDetails.path}?chartname=${script.chart}`}
                    className="text-decoration-none text-black"
                    key={script.id}
                  >
                    <div className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green">
                      <div className="col-5">
                        <span className="fw-bold fs-6">
                          <input
                            className="chbx"
                            type="checkbox"
                            name="scripts"
                            value={script.id}
                            onChange={handleCheckboxChange}
                          />
                          {script.title}
                        </span>
                      </div>
                      <div className="col-1 mx-auto text-center wrap-word">
                        {script.category1}
                      </div>
                      <div className="col-2 mx-auto text-center wrap-word">
                        {script.category2}
                      </div>
                      <div className="col-2 mx-auto text-center wrap-word">
                        {script.category3}
                      </div>
                      <div className="col-1 mx-auto text-center">
                        {script.startDate}
                      </div>
                      <div className="col-1 mx-auto text-center">
                        {script.endDate}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </form>
          ) : (
            <span className="text-large">
              Upload scripts to generate reports with them
            </span>
          )}
        </div>
      </div>

      <FilterModal show={show} handleClose={handleClose} />

      <SaveModal show={Saveshow} handleClose={handleSaveClose}/>
    </>
  );
};

export default CustomReport;
