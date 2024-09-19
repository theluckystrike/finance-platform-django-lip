import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import { Link } from "react-router-dom";
import { ActiveRoute } from "../../Menu";
import MergeReports from "../../Comopnent/ui/Modals/MergeReports/MergeReports";
import { GetAllreports } from "../../Redux/Report/Slice";
import { useDispatch, useSelector } from "react-redux";
import useSortableData from "../../customHook/useSortable";
import Loader from "../../Comopnent/ui/Loader";
import CreateReports from "../../Comopnent/ui/Modals/CreateReports/ModalReports";

const Report = () => {
 

  const dispatch = useDispatch();

  const [loginUser, setLoginUser] = useState<any>(null);

  const store: any = useSelector((i) => i);

  const { loading } = store?.report;
  const allreport = store?.report?.reports?.results; 
  const { items, requestSort, getClassNamesFor } = useSortableData(allreport || []);
  useEffect(() => {
    const storedLoginUser = localStorage.getItem("login");
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);
  useEffect(() => {
    const getDAta = async () => {
      try {
        await dispatch(GetAllreports({ token: loginUser?.access }));
      } catch (error) {
        //console.log(error);
      }
    };
    getDAta();
  }, [loginUser]);

 

 

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  return (
    <div className="mx-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h1 fw-bold">Reports </h1>
 
    
 
        <div className="btn-toolbar mb-2 mb-md-0">
        {/* <button
            onClick={handleShow}
            type="button"
            className="btn icon-button my-1 mx-2"
          >
            <Icon icon="Add" size="20px" />
            <span>Create</span>
          </button>*/}
          <button 
            onClick={handleShow}
            type="button"
            className="btn icon-button my-1 mx-2"
          >
            <Icon icon="AddChart" size="20px" />
            <span>Merge</span>
          </button>
        </div>
      </div>
      <div>
        {items.length > 0 ? (
          <form method="post" id="customReportForm">
            <div className="row mb-2 p-2 fw-bold w-100">
            <div className="col-1">
                <h5>Sr no.</h5>
              </div>
              <div className="col-7">
                <h5>Report Name</h5>
              </div>

              <div className="col-2 mx-auto text-center">Created</div>
              <div className="col-2 mx-auto text-center">Last updated</div>
            </div>
            <div id="scriptsCheckboxes">
              {items.map((script: any,index:any) => (
                <Link
                  to={`/account/ReportDetails/${script.id}`}
                  className="text-decoration-none text-black"
                  key={script.id}
                >
                  <div className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green">
                  <div className="col-1">
                      <span className="fw-bold fs-6">{index+1}</span>
                    </div>
                    <div className="col-7">
                      <span className="fw-bold fs-6">{script.name}</span>
                    </div>

                    <div className="col-2 mx-auto text-center">
                      {script.created}
                    </div>
                    <div className="col-2 mx-auto text-center">
                      {script.last_updated}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </form>
        ) : (
         <Loader/>
        )}
      </div>
      <CreateReports show={show} handleClose={handleClose} />

      {/* <MergeReports show={show} handleClose={handleClose} /> */}
    </div>
  );
};

export default Report;
