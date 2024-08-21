import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../ui/icon/Icon';
import FilterModal from '../ui/FilterModal/FilterModal';
import { ActiveRoute } from '../../Menu';

const ChartTable = () => {
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
          endTime: "10:03",
          chart:'LineChart'
        },
        {
          title: "Canada 2Yr - 5Yr vs. 5Yr - 10Yr Regression",
          category1: "Bonds",
          category2: "CAD Bonds",
          category3: "Regression-CAD",
          startDate: "11/18/23",
          endDate: "08/20/24",
          startTime: "17:39",
          endTime: "10:03",
          chart:'ScatterLineChart'

        },
        {
          title: "Factor Returns Table",
          category1: "Tape",
          category2: "Returns",
          category3: "Returns-Current",
          startDate: "04/16/24",
          endDate: "08/20/24",
          startTime: "18:47",
          endTime: "10:03",
          chart:'LineChart'

        },
        {
          title: "Philly and empire fed prices paid vs cpi",
          category1: "Monetary",
          category2: "Inflation",
          category3: "Inflation-Models",
          startDate: "11/16/23",
          endDate: "08/20/24",
          startTime: "22:56",
          endTime: "10:03",
          chart:'LineChart'

        },
        {
          title: "World Market ETFs Members 20pct 52WK High",
          category1: "Tape",
          category2: "Breadth",
          category3: "Participation/Disperson",
          startDate: "05/23/24",
          endDate: "08/20/24",
          startTime: "20:34",
          endTime: "10:03",
          chart:'LineChart'

        },
        {
          title: "U.S. 2y5y Fixed Income",
          category1: "Bonds",
          category2: "USD Bonds",
          category3: "Summary-USD",
          startDate: "01/19/24",
          endDate: "08/20/24",
          startTime: "12:47",
          endTime: "10:04",
          chart:'LineChart'
        },
        {
          title: "Continued Jobless Claims",
          category1: "Econ",
          category2: "Labour",
          category3: "Labour-Models",
          startDate: "08/08/24",
          endDate: "08/20/24",
          startTime: "19:44",
          endTime: "10:03",
          chart:'LineChart'

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
<>
        <div  className='mx-4'>
           
            <div>
                {132 > -1 ? (
                    <form method="post" id="customReportForm">
                        <div className="row mb-2 p-2 fw-bold w-100" >
                            <div className="col-5">
                                <h5>
                                    <input type="checkbox" id="selectAllCheckbox" onChange={toggleSelectAll} /> Name
                                </h5>
                            </div>
                            <div className="col-1 mx-auto text-center">Category</div>
                            <div className="col-2 mx-auto text-center">Sub Category 1</div>
                            <div className="col-2 mx-auto text-center">Sub Category 2</div>
                            <div className="col-1 mx-auto text-center">Created</div>
                            <div className="col-1 mx-auto text-center">Last updated</div>
                        </div>
                        <div id="scriptsCheckboxes">
                            {data.map((script:any) => (
                                <a href={`/account/${ActiveRoute.ScriptDetails.path}?chartname=${script.chart}`} className="text-decoration-none text-black" key={script.id}>
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

        
        </>
    );
};

export default ChartTable;
