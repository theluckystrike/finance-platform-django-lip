import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import FilterModal from "../../Comopnent/ui/Modals/FilterModal/FilterModal";
import { ActiveRoute } from "../../Menu";
import SaveModal from "../../Comopnent/ui/Modals/SaveModal/SaveModal";
import ArrowDown from '../../assest/image/arrow-down.png'
import { ScriptData } from "../../DummyData/TableData";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useSortableData from "../../customHook/useSortable";
import { GetAllScripts } from "../../Redux/Script/ScriptSlice";
import { loginUSer } from "../../customHook/getrole";
import DateFormatter from "../../customHook/useTImeformnt";
import Loader from "../../Comopnent/ui/Loader";

const CustomReport = () => {
 
const dispatch =useDispatch()
 
  // const { data, error, isLoading } = useGetAllProjectQuery({ token:'fds', page_no:1, page_size:1000 });

const store:any = useSelector((i)=>i)
 
 const {loading}=store?.script
 const allscripts = store?.script?.Scripts?.results
 const [selectedScripts, setSelectedScripts] = useState([]);
 //console.log(allscripts);
 
 const [loginUser, setLoginUser] = useState<any>(null);
 
   // Effect to retrieve loginUser from localStorage on component mount
   useEffect(() => {
     const storedLoginUser = localStorage.getItem("login");
     if (storedLoginUser) {
       setLoginUser(JSON.parse(storedLoginUser));
     }
   }, []);
  useEffect(()=>{
 
  
  const  getDAta =async ()=>{
    try {
      await  dispatch(GetAllScripts({token:loginUser?.access}))
    } catch (error) {
      //console.log(error);
    }
  }
  getDAta()
 
       },[loginUser])
 

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
    setSelectedScripts({...selected,...selectedScripts});
  };



  const { items, requestSort, getClassNamesFor } = useSortableData(allscripts || []);
 
  return (
    <> 
    
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h2">
            All scripts <span id="headerInfo">({items.length})</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">

            <button type="button" className="btn icon-button my-1 mx-2"  >
              <Icon icon="AddBusiness" size="20px" />
              <span >Home</span>
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
          {!loading ? (
            <form method="post" id="customReportForm">
              <div className="row mb-2 p-2 fw-bold w-100">
                <div className="col-4" >
                  <h5>
                    <input
                      type="checkbox"
                      id="selectAllCheckbox"
                      onChange={toggleSelectAll}
                    />{" "}
                    <span onClick={() => requestSort('name')}>

                    Name

                    <Icon
									size='10px'
									className={getClassNamesFor('name')}
									icon='FilterList'
                  />
                  </span>
                  </h5>
                </div>

               
                <div className="col-2 mx-auto text-center" onClick={() => requestSort('description')} >Description
                <Icon
									size='10px'
									className={getClassNamesFor('description')}
									icon='FilterList'
                  />

               
                </div>
                <div className="col-2 mx-auto text-center"  onClick={() => requestSort('category.name')}>Category<Icon
									size='10px'
									className={getClassNamesFor('category.name')}
									icon='FilterList'
                  />
</div>
                
                <div className="col-2 mx-auto text-center" onClick={() => requestSort('created')}>Created<Icon
									size='10px'
									className={getClassNamesFor('created')}
									icon='FilterList'
                  /></div>
                <div className="col-2 mx-auto text-center" onClick={() => requestSort('last_updated')}>LastUpdated<Icon
									size='10px'
									className={getClassNamesFor('last_updated')}
									icon='FilterList'
                  /></div>
              </div>
              <div id="scriptsCheckboxes">
                {items?.map((script: any,index:any) => (
                  <Link
                    to={`/account/ScriptDetails/${script.id}`}
                    className="text-decoration-none text-black"
                    key={index}
                  >
                    <div className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green">
                      <div className="col-4">
                        <span className="fw-bold  ">
                          <input
                            className="chbx"
                            type="checkbox"
                            name="scripts"
                            value={script.id}
                            onChange={handleCheckboxChange}
                          />
                          {script.name}
                        </span>
                      </div>
                      <div className="col-2 mx-auto text-center wrap-word">
                        {script.description}
                      </div>
                      <div className="col-2 mx-auto text-center wrap-word">
                        {script?.category?.name}
                      </div>
                      <div className="col-2 mx-auto text-center">
                      <DateFormatter isoString={script.created}/>
                      </div>
                      <div className="col-2 mx-auto text-center">
                      <DateFormatter isoString={script.last_updated}/>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </form>
          ) : (
            <span className="text-large">
               <Loader/>
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
