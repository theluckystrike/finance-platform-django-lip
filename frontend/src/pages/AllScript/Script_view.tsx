import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../../Comopnent/ui/icon/Icon';
import FilterModal from '../../Comopnent/ui/FilterModal/FilterModal';
import LineChart from '../../Comopnent/Charts/LineChart';
import ScatterLineChart from '../../Comopnent/Charts/LineScatter';
import { useLocation } from 'react-router-dom';
import ChartTable from '../../Comopnent/Table/ChartTable';

const Components:any = {
    ScatterLineChart: ScatterLineChart,
    LineChart: LineChart
  };
const ScriptView = () => {
    const location = useLocation();
  
    // Get the search parameters from the URL
    const searchParams = new URLSearchParams(location.search);
  
    // Retrieve the value of the 'chartname' parameter
    const chartName:any = searchParams.get('chartname') || <div></div>;
  
   const Reanding = Components[chartName] 
      
      const [show, setShow] = useState(false);

      const handleClose = () => setShow(false);
      const handleShow = () => {
        
        console.log('runing');
        
        setShow(true);
    
    }

const [activeComponet,setActivecomponet]=useState('chart')
   
   
   
    const today = new Date();
    const dateOnly = today.toISOString().split('T')[0];
 
    
    return (
<>
        <div  className='mx-4'>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center px-3 pt-3 pb-2 mb-3">
                <div>

                <h1 className="h1"> Gold Relative Strength <span id="headerInfo">(132)</span> </h1>
            <h6 className='ps-1'>Last update {dateOnly}</h6>

                </div>
             

            
                <div className="btn-toolbar mb-2 mb-md-0"  >
                <button type="button" className="btn icon-button my-1 mx-2"  >
                       <Icon icon='Edit' size='20px'/>
                        <span>Edit</span>
                    </button>
                    <button onClick={handleShow}   className="btn icon-button my-1 mx-2"  >
                       <Icon icon='PlayArrow' size='20px'/>
                        <span>Play</span>
                    </button>
                    <button type="button" className="btn icon-button my-1 mx-2"  >
                    <Icon icon='Delete' size='20px'/>

                        <span>Delete</span>
                    </button>
                    <button type="submit" form="customReportForm" className="btn icon-button my-1 mx-2  ">
                    <Icon icon='Info' size='20px'/>

                        <span>Info</span>
                    </button>
                 
        {activeComponet=== 'table'   &&   <button type="submit" form="customReportForm" onClick={()=>setActivecomponet('chart')} className="btn icon-button my-1 mx-2  ">
                    <Icon icon='InsertChart' size='20px'/>

                        <span>Chart</span>
                    </button>}
      
                    {activeComponet=== 'chart'   &&  <button type="submit" form="customReportForm" onClick={()=>setActivecomponet('table')} className="btn icon-button my-1 mx-2  ">
                    <Icon icon='TableRows' size='20px'/>

                        <span>Table</span>
                    </button>}
                </div>
            </div>
            <div>

            </div>

        {activeComponet=== 'table'   && <div style={{
                width:'90%',
                margin:'0px auto'
            }}>
            <ChartTable/>
            
            </div>}
           {activeComponet=== 'chart'   && <div style={{
                width:'80%',
                margin:'0px auto'
            }}>
                <Reanding/>
                <Reanding/>
                <Reanding/>



            </div>}
           
            {/* <div style={{
                width:'80%',
                margin:'0px auto'
            }}>

                <LineChart/>
                <LineChart/>

                <LineChart/>

                <LineChart/>

                <LineChart/>

            </div>
            */}
        </div>

        <FilterModal show={show} handleClose ={handleClose}/>
        </>
    );
};

export default ScriptView;
