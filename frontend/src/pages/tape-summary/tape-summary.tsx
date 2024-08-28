import React, { useState } from "react";
import "../../assest/css/AllScript.css";
import FilterModal from "../../Comopnent/ui/Modals/FilterModal/FilterModal";
import { ActiveRoute } from "../../Menu";
import SaveModal from "../../Comopnent/ui/Modals/SaveModal/SaveModal";
import { ScriptData, TapeSummaryData } from "../../DummyData/TableData";
import { useNavigate } from "react-router-dom";

const TapeSummary: React.FC = () => {
  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [saveShow, setSaveShow] = useState(false);
  const navigate = useNavigate();

  const toggleSelectAll = (event: React.ChangeEvent<any>) => {
    const checkboxes = document.querySelectorAll(
      '#scriptsCheckboxes input[type="checkbox"]'
    );
    checkboxes.forEach(
      (checkbox: any) => (checkbox.checked = event.target.checked)
    );
    handleCheckboxChange();
  };

  const handleCheckboxChange = (event?: React.ChangeEvent<any>) => {
    if (event) event.stopPropagation();

    const selected = Array.from(
      document.querySelectorAll(
        '#scriptsCheckboxes input[type="checkbox"]:checked'
      )
    ).map((checkbox: any) => checkbox.value);

    setSelectedScripts(selected);
  };
  

  const handleGetResults = () => {
    if (selectedScripts.length > 0) {
      const query = new URLSearchParams({ scriptIds: selectedScripts.join(',') }).toString();
      navigate(`/account/${ActiveRoute.TapeSummaryResult.path}?${query}`);
    }
  };

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1">
            Tape Summary <span id="headerInfo">(132)</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button
              className="btn bg-green opacity-100 text-light col py-2 px-3 justify-content-center"
              type="button"
              onClick={handleGetResults} 
              disabled={selectedScripts.length === 0}
            >
              Get Result
            </button>
          </div>
        </div>
        <div>
          {132 > -1 ? (
            <form method="post" id="customReportForm">
              <div className="row mb-2 p-2 fw-bold w-100">
                <div className="col-6">
                  <h5>
                    <input
                      type="checkbox"
                      id="selectAllCheckbox"
                      onChange={toggleSelectAll}
                    />{" "}
                    Name
                  </h5>
                </div>
                <div className="col-2 mx-auto text-center">Category</div>
                <div className="col-2 mx-auto text-center">Created</div>
                <div className="col-2 mx-auto text-center">Last updated</div>
              </div>
              <div id="scriptsCheckboxes">
                {TapeSummaryData.map((script: any) => (
                  <div
                    className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green"
                    key={script.id}
                  >
                    <div className="col-6">
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
                  
                    <div className="col-2 mx-auto text-center wrap-word">
                      {script.category}
                    </div>
                    <div className="col-2 mx-auto text-center wrap-word">
                      {script.category}
                    </div>
                 
                    <div className="col-2 mx-auto text-center">
                      {script.lastUpdated}
                    </div>
                  </div>
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

      <FilterModal show={show} handleClose={() => setShow(false)} />
      <SaveModal show={saveShow} handleClose={() => setSaveShow(false)} />
    </>
  );
};

export default TapeSummary;
