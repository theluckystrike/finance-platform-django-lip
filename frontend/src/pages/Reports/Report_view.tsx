import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../../Comopnent/ui/icon/Icon';

const ReportViwe = () => {
    const [category, setCategory] = useState("-1");
    const [subCategory, setSubCategory] = useState("-1");
    const [subSubCategory, setSubSubCategory] = useState("-1");
    const [selectedScripts, setSelectedScripts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const data = [
        {
          title: "S&P 500 While NASDAQ AND DJIA Decline",
          category1: "Tape",
          category2: "Relative Strength",
          category3: "RS",
          startDate: "08/18/24",
          endDate: "08/20/24",
          startTime: "18:52",
          endTime: "10:03"
        },
        {
          title: "Canada 2Yr - 5Yr vs. 5Yr - 10Yr Regression",
          category1: "Bonds",
          category2: "CAD Bonds",
          category3: "Regression-CAD",
          startDate: "11/18/23",
          endDate: "08/20/24",
          startTime: "17:39",
          endTime: "10:03"
        },
        {
          title: "Factor Returns Table",
          category1: "Tape",
          category2: "Returns",
          category3: "Returns-Current",
          startDate: "04/16/24",
          endDate: "08/20/24",
          startTime: "18:47",
          endTime: "10:03"
        },
        {
          title: "Philly and empire fed prices paid vs cpi",
          category1: "Monetary",
          category2: "Inflation",
          category3: "Inflation-Models",
          startDate: "11/16/23",
          endDate: "08/20/24",
          startTime: "22:56",
          endTime: "10:03"
        },
        {
          title: "World Market ETFs Members 20pct 52WK High",
          category1: "Tape",
          category2: "Breadth",
          category3: "Participation/Disperson",
          startDate: "05/23/24",
          endDate: "08/20/24",
          startTime: "20:34",
          endTime: "10:03"
        },
        {
          title: "U.S. 2y5y Fixed Income",
          category1: "Bonds",
          category2: "USD Bonds",
          category3: "Summary-USD",
          startDate: "01/19/24",
          endDate: "08/20/24",
          startTime: "12:47",
          endTime: "10:04"
        },
        {
          title: "Continued Jobless Claims",
          category1: "Econ",
          category2: "Labour",
          category3: "Labour-Models",
          startDate: "08/08/24",
          endDate: "08/20/24",
          startTime: "19:44",
          endTime: "10:03"
        }
      ];
      



    useEffect(() => {
        if (category !== "-1") {
            axios.get(`/categories/get-subcategories/${category}/`)
                .then((response:any) => {
                    setSubCategories(response.data.subcategories);
                    setSubCategory("-1");
                    setSubSubCategories([]);
                });
        } else {
            setSubCategories([]);
            setSubCategory("-1");
            setSubSubCategories([]);
        }
    }, [category]);

    useEffect(() => {
        if (subCategory !== "-1") {
            axios.get(`/categories/get-subcategories/${subCategory}/`)
                .then(response => {
                    setSubSubCategories(response.data.subcategories);
                    setSubSubCategory("-1");
                });
        } else {
            setSubSubCategories([]);
            setSubSubCategory("-1");
        }
    }, [subCategory]);

    const handleFilter = () => {
        let url = '/reports/custom-report/?';
        if (category !== "-1") url += `category=${category}`;
        if (subCategory !== "-1") url += `&subcategory1=${subCategory}`;
        if (subSubCategory !== "-1") url += `&subcategory2=${subSubCategory}`;
        window.location.replace(url);
    };

    const handleResetFilters = () => {
        window.location.replace('/reports/custom-report/');
    };

    const toggleSelectAll = (event:any) => {
        const checkboxes = document.querySelectorAll('#scriptsCheckboxes input[type="checkbox"]');
        checkboxes.forEach((checkbox:any) => checkbox.checked = event.target.checked);
        handleCheckboxChange();
    };

    const handleCheckboxChange = () => {
        const selected:any = Array.from(document.querySelectorAll('#scriptsCheckboxes input[type="checkbox"]:checked'))
            .map((checkbox:any) => checkbox.value);
        setSelectedScripts(selected);
    };

    return (
        <div  className='mx-4'>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h1">Report Details <span id="headerInfo">(12)</span></h1>
                <div className="btn-toolbar mb-2 mb-md-0" style={{zIndex:'-1'}}>
                <button type="button" className="btn icon-button my-1 mx-2" data-bs-toggle="modal" data-bs-target="#filtersModal">
                       <Icon icon='CalendarToday' size='20px'/>
                        <span>
Schedule
Email
</span>
                    </button>
                    <button type="button" className="btn icon-button my-1 mx-2" data-bs-toggle="modal" data-bs-target="#filtersModal">
                       <Icon icon='RemoveRedEye' size='20px'/>
                        <span>View Latest
</span>
                    </button>
                    <button type="button" className="btn icon-button my-1 mx-2" data-bs-toggle="modal" data-bs-target="#filtersModal">
                       <Icon icon='Delete' size='20px'/>
                        <span>Delete
</span>
                    </button>
                    <button type="button" className="btn icon-button my-1 mx-2" data-bs-toggle="modal" data-bs-target="#saveReportModal">
                    <Icon icon='SystemUpdateAlt' size='20px'/>

                        <span>Update
                        </span>
                    </button>
                    <button type="submit" form="customReportForm" className="btn icon-button my-1 mx-2  ">
                    <Icon icon='Info' size='20px'/>

                        <span>info</span>
                    </button>
                </div>
            </div>


            <form className="w-75" style={{ maxWidth: "600px" }} method="post" encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Add Script</label>
            <div className="row mx-0 p-0">
              <div className="col-10 m-0 p-0 pe-1">
                <select
                  id="category"
                  name="category"
                  className="form-select m-0"
                  
                  required
                >
                  <option value="" disabled selected>All</option>
                  <option value="Returns">Returns</option>
                  <option value="USD">USD</option>

                  <option value="Bonds">Bonds</option>

                  <option value="CAD">CAD</option>

                  <option value="Breadth">Breadth</option>

                </select>
              </div>
              <button
                className="btn btn-dark col col-2 p-0 fw-bold justify-content-center"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#newCategoryModal"
              >
               Add
              </button>
            </div>
          </div>
 
        </form>
            <div>
                {132 > -1 ? (
                    <form method="post" id="customReportForm">
                        <div className="row mb-2 p-2 fw-bold w-100" >
                            <div className="col-5">
                                <h5>
                                    <input type="checkbox" id="selectAllCheckbox" onChange={toggleSelectAll} /> Name
                                </h5>
                            </div>
                            <div className="col-2 mx-auto text-center">Category</div>
                            <div className="col-2 mx-auto text-center">Sub Category 1</div>
                            <div className="col-2 mx-auto text-center">Sub Category 2</div>
                            <div className="col-1 mx-auto text-center">Remove</div>
                         
                        </div>
                        <div id="scriptsCheckboxes">
                            {data.slice(0,5).map((script:any) => (
                                <a href={`/script/${script.name}`} className="text-decoration-none text-black" key={script.id}>
                                    <div className="row mb-2 p-3 table-card rounded-3 w-100 bg-light-green">
                                        <div className="col-5">
                                            <span className="fw-bold fs-6">
                                                <input className="chbx" type="checkbox" name="scripts" value={script.id} onChange={handleCheckboxChange} />
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
                                           <div className='bg-danger p-1 ms-auto' style={{
    width: '27px',
    borderRadius: '50%',
    color: 'white'
                                           }}>
                                           -
                                           </div>
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

export default ReportViwe;
