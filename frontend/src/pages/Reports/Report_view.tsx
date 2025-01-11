import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import ScheduleEmailModal from "../../Comopnent/ui/Modals/ScheduleEmailModal/ScheduleEmailModal";
import { ActiveRoute } from "../../Menu";

import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { GetAllScripts, setLoading } from "../../Redux/Script/ScriptSlice";
import {
  GetreportByIDs,
  GetSatusreportByIDs,
  Updatereports,
  UpdateReportss,
} from "../../Redux/Report/Slice";
import DateFormatter from "../../customHook/useTImeformnt";
import useToast from "../../customHook/toast";
import Loader from "../../Comopnent/ui/Loader";
import DeleteModal from "./ReportDelete";
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Create new plugin instance

const ReportViwe = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  // Get the search parameters from the URL
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loginUser, setLoginUser] = useState<any>(null);
  const handleToast = useToast();
  
  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    const storedLoginUser = localStorage.getItem("login");
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  const getStatus =async ()=>{
    await dispatch(GetSatusreportByIDs({ id: id, token: loginUser?.access }));

  }

  useEffect(() => {
    dispatch(setLoading(true));
    if (loginUser) {
      const getreport = async () => {
        await dispatch(GetreportByIDs({ id: id, token: loginUser?.access }));
       await getStatus()
        await dispatch(GetAllScripts({ token: loginUser?.access }));
        dispatch(setLoading(false));
      };
      getreport();
    }
  }, [loginUser]);

  const store: any = useSelector((i) => i);
  const reportData = store?.report?.report;
  const reportStatus = store?.report?.reportStatus;  
  const allscripts = store?.script?.Scripts?.results || [];
  const { loading } = store?.report;
  useEffect(() => {
    let intervalId: any;
    if (reportStatus.status === 'running') {
      intervalId = setInterval(() => {
        getStatus();
      }, 5000);
    }

    if (reportStatus.status === 'success') {
      dispatch(GetreportByIDs({ id: id, token: loginUser?.access }));
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [reportStatus]);

  // Safeguard against undefined or null values for reportData.scripts
  const filteredScripts = allscripts.filter((script: any) => {
    return (
      Array.isArray(reportData?.scripts) &&
      reportData.scripts.includes(script.id)
    );
  });

  const [selectScript, setSelectScript] = useState({
    name: "",
    id: "",
  });

  const [show, setShow] = useState(false);
  const [Deleteshow, setDeleteShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleUpdate = async () => {
    await dispatch(
      Updatereports({
        values: {
          name: reportData.name,
          scripts: [...reportData.scripts, selectScript.id],
        },
        token: loginUser.access,
        id: id,
      })
    );

    handleToast.SuccessToast(`Update Report successfully`);
  };

  const removeScript = async (val: any) => {
    const reduceArray = reportData.scripts.filter((i: any) => i !== val);
    await dispatch(
      Updatereports({
        values: {
          name: reportData.name,
          scripts: [...reduceArray],
        },
        token: loginUser.access,
        id: id,
      })
    );
    handleToast.SuccessToast(`Remove Script successfully`);
  };

  const openPdfInNewTab = (url: any) => {
    if (url){
      window.open(url, "_blank");
    }
    else{
      handleToast.SuccessToast("Please update the script first, then wait for the PDF to generate successfully.");
      updateRepost() 

    }
    
  };

  const updateRepost = async () => {
    const res = await dispatch(
      UpdateReportss({ token: loginUser.access, id: id })
    );
    getStatus()
    if (res.payload) {
      handleToast.SuccessToast(res.payload.message);
    }
  };
  return (
    <>
      <div className="mx-5 py-3">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1">
            Report Details <span id="headerInfo">({reportData.name})</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button
              onClick={handleShow}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <Icon icon="CalendarToday" size="20px" />
              <span>Schedule Email</span>
            </button>
            <button
              type="button"
              onClick={() => openPdfInNewTab(reportData?.latest_pdf)}
              className="btn icon-button my-1 mx-2"
            >
             {reportStatus.status === 'running'?<>
              <Loader />
              <span>Running</span>
             </>
              : <>
              <Icon icon="RemoveRedEye" size="20px" />
              <span>View Latest</span>
             </>
              }
            </button>
            <button
              type="button"
              className="btn icon-button my-1 mx-2"
              onClick={() => setDeleteShow(true)}
            >
              <Icon icon="Delete" size="20px" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              className="btn icon-button my-1 mx-2"
              onClick={updateRepost}
            >
              <Icon icon="SystemUpdateAlt" size="20px" />

              <span>Update</span>
            </button>
            <button type="submit" className="btn icon-button my-1 mx-2">
              <Icon icon="Info" size="20px" />

              <span>info</span>
            </button>
          </div>
        </div>

        <form
          className="w-75"
          style={{ maxWidth: "600px" }}
          method="post"
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Add report
            </label>
            <div className="row mx-0 p-0">
              <div className="col-10 m-0 p-0 pe-1">
                <div className="dropdown">
                  <input
                    type="text"
                    placeholder="All"
                    value={selectScript.name}
                  />
                  <div
                    className="dropdown-content"
                    style={{ height: "200px", overflow: "auto" }}
                  >
                    {allscripts.map((script: any, index: any) => (
                      <span
                        key={index}
                        onClick={() =>
                          setSelectScript({
                            name: script.name,
                            id: script.id,
                          })
                        }
                        className="hover-span"
                      >
                        {script.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-dark col col-2 p-0 fw-bold justify-content-center"
                type="button"
                disabled={selectScript.name == ""}
                onClick={handleUpdate}
              >
                Add
              </button>
            </div>
          </div>
        </form>
        <div>
          {!loading ? (
            <div id="customReportForm" style={{ overflow: "auto" }}>
              <table className="table   w-100" style={{ minWidth: "1000px" }}>
                <thead>
                  <tr className="fw-bold mb-2 p-2">
                    <th scope="col" className="col-5">
                      <h5>
                        <input type="checkbox" id="selectAllCheckbox" /> Name
                      </h5>
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      Category
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      <h6>
                        <span>Sub Category 1 </span>
                      </h6>
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      <h6>
                        <span>Sub Category 2 </span>
                      </h6>
                    </th>

                    <th scope="col" className="col-2 text-center mx-auto">
                      Created
                    </th>
                    <th scope="col" className="col-1 text-center mx-auto">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody id="reportsCheckboxes">
                  {filteredScripts ? (
                    filteredScripts.map((report: any) => (
                      <>
                        <tr
                          key={report.id}
                          className="table-card rounded-3 bg-light-green mb-2 p-3"
                        >
                          <td className="col-5">
                            <Link
                              to={`/account/ScriptDetails/${report.id}`}
                              className="text-decoration-none text-black"
                            >
                              <span className="fw-bold fs-6">
                                <input
                                  className="chbx"
                                  type="checkbox"
                                  name="reports"
                                  value={report.id}
                                />
                                {report.name}
                              </span>
                            </Link>
                          </td>
                          <td className="col-2 text-center mx-auto wrap-word">
                            {report?.category?.name}
                          </td>
                          <td className="col-2 text-center wrap-word mx-auto">
                            {report.category?.parent_category?.name}
                          </td>
                          <td className="col-2 text-center wrap-word mx-auto">
                            {
                              report.category?.parent_category?.parent_category
                                ?.name
                            }
                          </td>

                          <td className="col-2 text-center mx-auto">
                            <DateFormatter isoString={report.created} />
                          </td>
                          <td className="col-1 text-center mx-auto">
                            <div
                              onClick={() => removeScript(report.id)}
                              className="bg-danger p-1 ms-auto"
                              style={{
                                width: "27px",
                                borderRadius: "50%",
                                color: "white",
                              }}
                            >
                              -
                            </div>
                          </td>
                        </tr>
                        <tr style={{ height: "10px" }}></tr>
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <Loader />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <ScheduleEmailModal show={show} handleClose={handleClose} />
      <DeleteModal
        show={Deleteshow}
        handleClose={() => setDeleteShow(false)}
        data={reportData}
        token={loginUser?.access}
      />
    </>
  );
};

export default ReportViwe;
