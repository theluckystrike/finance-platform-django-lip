import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import LineChart from "../../Comopnent/Charts/LineChart";
import ScatterLineChart from "../../Comopnent/Charts/LineScatter";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PresentPastToggle from "../../Comopnent/ui/PresentPastToggle";
import { ActiveRoute } from "../../Menu";
import { useDispatch, useSelector } from "react-redux";
import {
  GetScriptByIDs,
  RunScripts,
  setLoading,
} from "../../Redux/Script/ScriptSlice";
import { tokenToString } from "typescript";
import { loginUSer } from "../../customHook/getrole";
import DateFormatter from "../../customHook/useTImeformnt";
import DeleteModal from "../../Comopnent/ui/Modals/DeleteModal/DeleteModal";
import Loader from "../../Comopnent/ui/Loader";
import CsvTable from "../../Comopnent/TableData/CsvTable";
import { object } from "yup";

const Components: any = {
  ScatterLineChart: ScatterLineChart,
  LineChart: LineChart,
};
const ScriptView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loginUser, setLoginUser] = useState<any>(null);

  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    const storedLoginUser = localStorage.getItem("login");
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  useEffect(() => {
    dispatch(setLoading(true));
    const getScript = async () => {
      if (loginUser?.access) {
        await dispatch(GetScriptByIDs({ id: id, token: loginUser?.access }));
        dispatch(setLoading(false));
      }
      
    };
    getScript();
  }, [loginUser]);

  const store: any = useSelector((i) => i);

  const ScriptData = store?.script?.Script;
console.log(ScriptData,'ScriptData');

  const { loading } = store?.script;

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

  const [changeView, setChangeView] = useState(false);

  const runScript = () => {
    dispatch(setLoading(true));
    try {
      setTimeout(() => {
        dispatch(RunScripts({ id: id, token: loginUser?.access }));
      }, 200);
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <>
      <div className="mx-4">
        <div className="row justify-content-between flex-wrap flex-md-nowrap  px-3 pt-3 pb-2 mb-3">
          <div className="col-md-8">
            <h2 className="h2">
              {" "}
              {ScriptData.name}
              {/* <span id="headerInfo">(132)</span>{" "} */}
            </h2>
            <h6 className="ps-1">
              Last update <DateFormatter isoString={ScriptData.last_updated} />
            </h6>
          </div>
          <div className="col-md-4 btn-toolbar mb-2 mb-md-0">
            <button
              onClick={editScript}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <Icon icon="Edit" size="20px" />
              <span>Edit</span>
            </button>
            <button onClick={runScript} className="btn icon-button my-1 mx-2">
              <Icon icon="PlayArrow" size="20px" />
              <span>Play</span>
            </button>
            <button
              type="button"
              onClick={handleShow}
              className="btn icon-button my-1 mx-2"
            >
              <Icon icon="Delete" size="20px" />

              <span>Delete</span>
            </button>
            {ScriptData?.output_type === "pd plt" && (
              <button
                onClick={() => setChangeView(!changeView)}
                type="button"
                className="btn icon-button my-1 mx-2"
              >
                <Icon icon={changeView ? "InsertChart" : "TableView"} size="20px"/>
                <span>{changeView ? "Chart" : "Table"}</span>
              </button>
            )}
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
                  <p>
                    {" "}
                    <DateFormatter isoString={ScriptData.created} />{" "}
                  </p>
                </div>
                <div className="tooltip_text_row d-flex justify-content-between  mb-2 text-left">
                  <h6>Last Run:</h6>
                  <p>
                    {" "}
                    <DateFormatter isoString={ScriptData.last_updated} />{" "}
                  </p>
                </div>

                {/* tooltip two */}
                <div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>ID (for API)</h6>
                    <p>{ScriptData.id}</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Category:</h6>
                    <p>{ScriptData.category?.name}</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Uploaded: </h6>
                    <p>April 28,2024,6:45 pm.</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Last Updated: </h6>
                    <p>
                      <DateFormatter isoString={ScriptData.last_updated} />
                    </p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Output data type: </h6>
                    <p>Chart(Using matplotlib.pyplot.savefig())</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div></div>
        <PresentPastToggle />
        {loading ? (
          <Loader />
        ) : (
          <div>
            {ScriptData?.output_type === "plt" ||
            (ScriptData?.output_type === "pd plt" && changeView === false) ? (
              <div
                style={{
                  width: "80%",
                  margin: "0px auto",
                }}
              >
                {/* <LineChart /> */}
                <img
                  src={ScriptData?.chart_data?.image_file}
                  alt=""
                  width="100%"
                />
              </div>
            ) : (
              <CsvTable csvUrl={ScriptData?.table_data?.csv_data} />
            )}
          </div>
        )}
      </div>

      <DeleteModal
        show={show}
        token={loginUSer?.access}
        data={ScriptData}
        handleClose={handleClose}
      />
    </>
  );
};

export default ScriptView;
 
