import React, { useState } from "react";
import "../../assest/css/AllScript.css";
import Icon from "../../Comopnent/ui/icon/Icon";
import FilterModal from "../../Comopnent/ui/Modals/FilterModal/FilterModal";
import { ActiveRoute } from "../../Menu";
import SaveModal from "../../Comopnent/ui/Modals/SaveModal/SaveModal";
import ArrowDown from '../../assest/image/arrow-down.png'
import { ScriptData } from "../../DummyData/TableData";
import { useCreateScriptMutation } from "../../Redux/Script";
import { useGetAllProjectQuery } from "../../Redux/Project";
import { useSelector } from "react-redux";

const CustomReport = () => {
 

  const { data, error, isLoading } = useGetAllProjectQuery({ token:'fds', page_no:1, page_size:1000 });
console.log(data,'data');
const store = useSelector((i)=>i)
console.log(store,'store');

  const [selectedScripts, setSelectedScripts] = useState([]);
  const [sortedData, setSortedData] = useState<any>([]);
  const [sortValue,setSortValue]=useState('')

 

  const handleShort = (value:any)=>{
    setSortValue(value)
    if(value==='Last Created'){
      const sortedArray =  ScriptData.sort((a: any, b: any) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
     
      console.log(sortedArray.reverse() ,'sortedArray');
      
      setSortedData(sortedArray );
    }
  }
 

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
 
  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1">
            All scripts <span id="headerInfo">(132)</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">



          <form
          className=""
          
          method="post"
          encType="multipart/form-data"
        >
       

       
          <div className="mt-1 ">
          
          <div className="dropdown">
              <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                <input type="text" placeholder="Sort by" value={sortValue}   />
                <div className="dropdown-content">
                  <span className="hover-span" onClick={()=>handleShort('Last Created')}>Last Created</span>
                  {/* <span className="hover-span">Last Update</span>
                  <span className="hover-span">A to z</span>
                  <span className="hover-span">Z to a</span> */}

                </div>
              </div>
             
          </div>
          </form>



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
                {sortedData.length < 0 ?sortedData.reverse():ScriptData.map((script: any) => (
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
