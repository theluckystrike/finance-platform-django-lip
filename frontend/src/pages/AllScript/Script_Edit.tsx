import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../../Comopnent/ui/icon/Icon';
import FilterModal from '../../Comopnent/ui/Modals/FilterModal/FilterModal';
import LineChart from '../../Comopnent/Charts/LineChart';
import ScatterLineChart from '../../Comopnent/Charts/LineScatter';
import { useLocation, useNavigate } from 'react-router-dom';
import ChartTable from '../../Comopnent/Table/ChartTable';
import PresentPastToggle from '../../Comopnent/ui/PresentPastToggle';
import CodeEdit from '../../Comopnent/CodeEditer/CodeEditer';

const Components:any = {
    ScatterLineChart: ScatterLineChart,
    LineChart: LineChart
  };
const ScriptEdit
 = () => {
    const Navigate =useNavigate()
    const location = useLocation();
  
    // Get the search parameters from the URL
    const searchParams = new URLSearchParams(location.search);
  
    // Retrieve the value of the 'chartname' parameter
    const chartName:any = searchParams.get('chartname') || <div></div>;
   
    return (
<>
<div className="m-4 ">
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
       <button className='btn mb-3' onClick={()=>Navigate(-1)}><Icon icon='ArrowBack'size='45px'  color="dark"/></button> <h1 className="h1 fw-bold">Editing (S&P 500 Sectors RoC On October 2008)</h1>
      </div>

      <div className="d-flex justify-content-center">
        <form
          className="w-75"
          
          method="post"
          encType="multipart/form-data"
        >
       

       
          <div className="mb-3">
            <label htmlFor="Description" className="form-label">
            Description
            </label>
            <textarea
            rows={3}
              id="Description"
              name="Description"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Code" className="form-label">
              Code
            </label>
            {/* <textarea
              rows={15}
              id="Code"
              name="Code"
              className="form-control"
            /> */}

            <CodeEdit/>
          </div>
 

          <div className="mx-auto text-center">
            <button type="submit" className="btn btn-dark px-5">
              Save Changes
            </button>
          </div>
        </form>
      </div>
       
    </div>
        
        </>
    );
};

export default ScriptEdit
;
