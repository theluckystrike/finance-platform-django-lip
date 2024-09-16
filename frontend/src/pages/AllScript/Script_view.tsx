import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import FilterModal from "../../Comopnent/ui/Modals/FilterModal/FilterModal";
import LineChart from "../../Comopnent/Charts/LineChart";
import ScatterLineChart from "../../Comopnent/Charts/LineScatter";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChartTable from "../../Comopnent/Table/ChartTable";
import PresentPastToggle from "../../Comopnent/ui/PresentPastToggle";
import { ActiveRoute } from "../../Menu";
import { useDispatch, useSelector } from "react-redux";
import { GetScriptByIDs } from "../../Redux/Script/ScriptSlice";
import { tokenToString } from "typescript";
import { loginUSer } from "../../customHook/getrole";
import DateFormatter from "../../customHook/useTImeformnt";
import DeleteModal from "../../Comopnent/ui/Modals/DeleteModal/DeleteModal";

const Components: any = {
  ScatterLineChart: ScatterLineChart,
  LineChart: LineChart,
};
const ScriptView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch =useDispatch();
  // Get the search parameters from the URL
const {id} =useParams()

 

  useEffect(()=>{
    dispatch(GetScriptByIDs({id:id,token:loginUSer.access}))
  },[])

  const store:any = useSelector((i)=>i)
 
  
  const ScriptData = store?.script?.Script 
 

 

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const [activeComponet, setActivecomponet] = useState("chart");
  const today = new Date();
  const dateOnly = today.toISOString().split("T")[0];

  const editScript = () => {
    navigate(`/account/${ActiveRoute.ScriptEdit.path}`);
  };
  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center px-3 pt-3 pb-2 mb-3">
          <div>
            <h1 className="h1">
              {" "}
              {ScriptData.name}
               {/* <span id="headerInfo">(132)</span>{" "} */}
            </h1>
            <h6 className="ps-1">Last update <DateFormatter isoString={ScriptData.created}/></h6>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button
              onClick={editScript}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <Icon icon="Edit" size="20px" />
              <span>Edit</span>
            </button>
            <button onClick={handleShow} className="btn icon-button my-1 mx-2">
              <Icon icon="PlayArrow" size="20px" />
              <span>Play</span>
            </button>
            <button type="button" onClick={handleShow} className="btn icon-button my-1 mx-2">
              <Icon icon="Delete" size="20px" />

              <span>Delete</span>
            </button>
            {/* <button type="submit" form="customReportForm" className="btn icon-button my-1 mx-2  ">
                    <Icon icon='Info' size='20px'/>

                        <span>Info</span>
                    </button> */}
            <button
              className="tooltip-btn btn icon-button my-1 mx-2"
              type="submit"
              form="customReportForm"
            >
              {" "}
              <Icon icon="Info" size="20px" />
              <span>Info</span>
              <div className="tooltip-text">
                <div className="tooltip_text_row d-flex justify-content-between  mb-2 text-left">
                  <h6>Created:</h6>
                  <p>July 1,2024,4:43pm</p>
                </div>
                <div className="tooltip_text_row d-flex justify-content-between  mb-2 text-left">
                  <h6>Last Run:</h6>
                  <p>July 9,2024,8:53am</p>
                </div>

{/* tooltip two */}

                {/* <div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>ID (for API)</h6>
                    <p>224</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Category:</h6>
                    <p>breadth--Breadth 1--general2</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Uploaded: </h6>
                    <p>April 28,2024,6:45 pm.</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Last Updated: </h6>
                    <p>April 28,2024,10:01 am.</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Output data type: </h6>
                    <p>Chart(Using matplotlib.pyplot.savefig())</p>
                  </div>
                </div> */}
              </div>
            </button>
            {activeComponet === "table" && (
              <button
                type="submit"
                form="customReportForm"
                onClick={() => setActivecomponet("chart")}
                className="btn icon-button my-1 mx-2  "
              >
                <Icon icon="InsertChart" size="20px" />

                <span>Chart</span>
              </button>
            )}

            {/* {activeComponet=== 'chart'   &&  <button type="submit" form="customReportForm" onClick={()=>setActivecomponet('table')} className="btn icon-button my-1 mx-2  ">
                    <Icon icon='TableRows' size='20px'/>

                        <span>Table</span>
                    </button>} */}
          </div>
        </div>
        <div></div>
        <PresentPastToggle />
        {activeComponet === "table" && (
          <div
            style={{
              width: "90%",
              margin: "0px auto",
            }}
          >
            <ChartTable />
          </div>
        )}
        {activeComponet === "chart" && (
          <div
            style={{
              width: "80%",
              margin: "0px auto",
            }}
          >
            <LineChart />
            
          </div>
        )}
      </div>

      {/* <FilterModal show={show} handleClose={handleClose} /> */}

      <DeleteModal show={show} token={loginUSer.access} data={ScriptData} handleClose={handleClose}/>
    </>
  );
};

export default ScriptView;
