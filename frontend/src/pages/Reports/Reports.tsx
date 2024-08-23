 
import React, { useState } from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../../Comopnent/ui/icon/Icon';
import { Link } from 'react-router-dom';
import { ActiveRoute } from '../../Menu';

const  Report = () => {
    const [category, setCategory] = useState("-1");
    const [subCategory, setSubCategory] = useState("-1");
    const [subSubCategory, setSubSubCategory] = useState("-1");
    const [selectedScripts, setSelectedScripts] = useState([]);
 
    const data = [
        {
title:'Merged example 1 and example 2',
            category1: "Tape",
          category2: "Relative Strength",
          category3: "RS",
          startDate: "08/18/24",
          endDate: "08/20/24",
          startTime: "18:52",
          endTime: "10:03"
        },
        {
title:'Merged example 1 and example 2',
            category1: "Bonds",
          category2: "CAD Bonds",
          category3: "Regression-CAD",
          startDate: "11/18/23",
          endDate: "08/20/24",
          startTime: "17:39",
          endTime: "10:03"
        },
        {
title:'Merged example 1 and example 2',
            category1: "Tape",
          category2: "Returns",
          category3: "Returns-Current",
          startDate: "04/16/24",
          endDate: "08/20/24",
          startTime: "18:47",
          endTime: "10:03"
        },
        {
title:'Merged example 1 and example 2',
            category1: "Monetary",
          category2: "Inflation",
          category3: "Inflation-Models",
          startDate: "11/16/23",
          endDate: "08/20/24",
          startTime: "22:56",
          endTime: "10:03"
        },
        {
title:'Merged example 1 and example 2',
            category1: "Tape",
          category2: "Breadth",
          category3: "Participation/Disperson",
          startDate: "05/23/24",
          endDate: "08/20/24",
          startTime: "20:34",
          endTime: "10:03"
        },
        {
title:'Merged example 1 and example 2',
            category1: "Bonds",
          category2: "USD Bonds",
          category3: "Summary-USD",
          startDate: "01/19/24",
          endDate: "08/20/24",
          startTime: "12:47",
          endTime: "10:04"
        },
        {
title:'Merged example 1 and example 2',
            category1: "Econ",
          category2: "Labour",
          category3: "Labour-Models",
          startDate: "08/08/24",
          endDate: "08/20/24",
          startTime: "19:44",
          endTime: "10:03"
        }
      ];
      


 

   

    const handleFilter = () => {
        let url = '/reports/custom-report/?';
        if (category !== "-1") url += `category=${category}`;
        if (subCategory !== "-1") url += `&subcategory1=${subCategory}`;
        if (subSubCategory !== "-1") url += `&subcategory2=${subSubCategory}`;
        window.location.replace(url);
        setSelectedScripts([])
    };

    const handleResetFilters = () => {
        window.location.replace('/reports/custom-report/');
    };

 

   

    return (
        <div  className='mx-4'>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h1 fw-bold">Reports </h1>
                <div className="btn-toolbar mb-2 mb-md-0" style={{zIndex:'-1'}}>
                <button type="button" className="btn icon-button my-1 mx-2" data-bs-toggle="modal" data-bs-target="#filtersModal">
                       <Icon icon='AddChart' size='20px'/>
                        <span>Merge</span>
                    </button>
                     
                </div>
            </div>
            <div>
                {132 > -1 ? (
                    <form method="post" id="customReportForm">
                        <div className="row mb-2 p-2 fw-bold w-100" >
                            <div className="col-8">
                                <h5>
                                     Report Name
                                </h5>
                            </div>
                           
                            <div className="col-2 mx-auto text-center">Created</div>
                            <div className="col-2 mx-auto text-center">Last updated</div>
                        </div>
                        <div id="scriptsCheckboxes">
                            {data.map((script:any) => (
                                <Link to={`/account/${ActiveRoute.ReportDetails.path}`} className="text-decoration-none text-black" key={script.id}>
                                    <div className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green">
                                        <div className="col-8">
                                            <span className="fw-bold fs-6">
                                           
                                                {script.title}
                                          
                                            </span>
                                        </div>
                                         
                                        <div className="col-2 mx-auto text-center">
                                            {script.startDate}
                                        </div>
                                        <div className="col-2 mx-auto text-center">
                                            {script.endDate}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </form>
                ) : (
                    <span className="text-large">
                        Upload scripts to generate reports with them
                    </span>
                )}
            </div>

            <div className="modal fade" id="saveReportModal" tabIndex={-1} aria-labelledby="saveReportModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form action="/save_custom_report" >
                            <div className="modal-header">
                                <h5 className="modal-title" id="saveReportModalLabel">Create a new custom report</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="report_name" className="form-label">Name</label>
                                <input type="text" name="name" id="report_name" className="form-control" required />
                                <select name="scripts" className="d-none" multiple>
                                    {selectedScripts.map((scriptId) => (
                                        <option value={scriptId} key={scriptId} selected>Script {scriptId}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-dark">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="filtersModal" tabIndex={-1} aria-labelledby="filtersModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content px-4">
                        <div className="modal-body">
                            <div id="filters" className="row">
                                <div className="col-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 col-sm-12 mb-3">
                                    <label className="form-label">Category</label>
                                    <select id="categoryselect" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="-1">All</option>
                                     
                                    </select>
                                </div>
                                <div className="col-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 col-sm-12 mb-3">
                                    <label className="form-label">Sub category 1</label>
                                    <select id="subcategoryselect" className="form-select" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                                        <option value="-1">All</option>
                                      
                                    </select>
                                </div>
                                <div className="col-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 col-sm-12">
                                    <label className="form-label">Sub category2</label>
                                    <select id="subsubcategoryselect" className="form-select" value={subSubCategory} onChange={(e) => setSubSubCategory(e.target.value)}>
                                        <option value="-1">All</option>
                                    
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-dark" onClick={handleFilter}>Filter</button>
                                <button type="button" className="btn btn-outline-dark" onClick={handleResetFilters}>Reset Filters</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
