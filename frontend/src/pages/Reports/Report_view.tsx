import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import ScheduleEmailModal from "../../Comopnent/ui/Modals/ScheduleEmailModal/ScheduleEmailModal";
import { ActiveRoute } from "../../Menu";
 
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { GetAllScripts, setLoading } from "../../Redux/Script/ScriptSlice";
import { GetreportByIDs, Updatereports } from "../../Redux/Report/Slice";
import DateFormatter from "../../customHook/useTImeformnt";
import useToast from "../../customHook/toast";
import Loader from "../../Comopnent/ui/Loader";
 

const ReportViwe = () => {
  // Get the search parameters from the URL
const {id} =useParams()
const dispatch=useDispatch()
const [loginUser, setLoginUser] = useState<any>(null);
 const handleToast =useToast()
// Effect to retrieve loginUser from localStorage on component mount
useEffect(() => {
  const storedLoginUser = localStorage.getItem("login");
  if (storedLoginUser) {
    setLoginUser(JSON.parse(storedLoginUser));
  }
}, []);

  useEffect(()=>{
    dispatch(setLoading(true));
    const getreport= async()=>{

      await  dispatch(GetreportByIDs({id:id,token:loginUser?.access}))
      await  dispatch(GetAllScripts({token:loginUser?.access}))
      dispatch(setLoading(false));
    }
    getreport()
  },[loginUser])


  const store: any = useSelector((i) => i);
  const reportData = store?.report?.report;
  const allscripts = store?.script?.Scripts?.results || [];
  const { loading } = store?.report;
  
  // Safeguard against undefined or null values for reportData.scripts
  const filteredScripts = allscripts.filter((script: any) => {
    return Array.isArray(reportData?.scripts) && reportData.scripts.includes(script.id);
  });
  
 const [selectScript,setSelectScript]=useState({
  name:'',
  id:''
 })
 
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handleUpdate =async ()=>{
  await  dispatch(Updatereports({
      values:{
        "name": reportData.name,
        scripts:[...reportData.scripts,
          selectScript.id
        ]
      },
      token:loginUser.access,
      id:id
    }))


    handleToast.SuccessToast(`Update Report successfully`);
  }
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
            <button type="button" className="btn icon-button my-1 mx-2">
              <Icon icon="RemoveRedEye" size="20px" />
              <span>View Latest</span>
            </button>
            <button type="button" className="btn icon-button my-1 mx-2">
              <Icon icon="Delete" size="20px" />
              <span>Delete</span>
            </button>
            <button type="button" className="btn icon-button my-1 mx-2">
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
                  <input type="text" placeholder="All" value={selectScript.name}/>
                  <div className="dropdown-content" style={{height:'200px',overflow:'auto'}}>
                  {allscripts.map((script:any,index:any)=>(  <span key={index} onClick={()=>setSelectScript({
                    name:script.name,
                    id:script.id
                  })} className="hover-span">{script.name}</span>))}
         
                  </div>
                </div>
              </div>
              <button
                className="btn btn-dark col col-2 p-0 fw-bold justify-content-center"
                type="button"
                disabled={selectScript.name  == ''}
                onClick={handleUpdate}
              >
                Add
              </button>
            </div>
          </div>
        </form>
        <div>
          {132 > -1 ? (
            <form method="post" id="customReportForm">
              <div className="row mb-2 p-2 fw-bold w-100">
                <div className="col-5">
                  <h5>
                    <input
                      type="checkbox"
                      id="selectAllCheckbox"
                       
                    />{" "}
                    Name
                  </h5>
                </div>
            
                <div className="col-2 mx-auto text-center">Description</div>
                <div className="col-2 mx-auto text-center">Category</div>
                <div className="col-2 mx-auto text-center">Created</div>
                <div className="col-1 mx-auto text-center">Remove</div>
              </div>
              <div id="reportsCheckboxes">
                {filteredScripts ? ( filteredScripts.map((report: any) => (
                  <Link
                    to={`/account/ScriptDetails/${report.id}`}
                    className="text-decoration-none text-black"
                    key={report.id}
                  >
                    <div className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green">
                      <div className="col-5">
                        <span className="fw-bold fs-6">
                          <input
                            className="chbx"
                            type="checkbox"
                            name="reports"
                            value={report.id}
                 
                          />
                          {report.name}
                        </span>
                      </div> 
                       <div className="col-2 mx-auto text-center wrap-word">
                        {report.Description}
                      </div>
                      <div className="col-2 mx-auto text-center wrap-word">
                        {report?.category?.name}
                      </div>
                    
                      <div className="col-2 mx-auto text-center">
                      <DateFormatter isoString={report.created}/>
                      </div>
                      <div className="col-1 mx-auto text-center">
                        <div
                          className="bg-danger p-1 ms-auto"
                          style={{
                            width: "27px",
                            borderRadius: "50%",
                            color: "white",
                          }}
                        >
                          -
                        </div>
                      </div>
                    </div>
                  </Link>
                ))):
                
                <Loader/>
                }
              </div>
            </form>
          ) : (
            <span className="text-large">
              Upload reports to generate reports with them
            </span>
          )}
        </div>
      </div>
      <ScheduleEmailModal show={show} handleClose={handleClose} />
    </>
  );
};

export default ReportViwe;
