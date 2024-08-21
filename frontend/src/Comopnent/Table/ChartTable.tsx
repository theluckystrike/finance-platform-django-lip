import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../ui/icon/Icon';
import FilterModal from '../ui/FilterModal/FilterModal';
import { ActiveRoute } from '../../Menu';
import { Tabledata } from '../../DummyData/TableData';

const ChartTable = () => {
    const [category, setCategory] = useState("-1");
    const [subCategory, setSubCategory] = useState("-1");
    const [subSubCategory, setSubSubCategory] = useState("-1");
    const [selectedScripts, setSelectedScripts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
 
      
 


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

    const scrollRef = useRef<HTMLDivElement>(null);
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const mouseDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        isDown = true;
        const el = scrollRef.current;
        if (el) {
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
            el.style.cursor = 'grabbing';
        }
    };

    const mouseLeaveHandler = () => {
        isDown = false;
        const el = scrollRef.current;
        if (el) el.style.cursor = 'grab';
    };

    const mouseUpHandler = () => {
        isDown = false;
        const el = scrollRef.current;
        if (el) el.style.cursor = 'grab';
    };

    const mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDown) return;
        e.preventDefault();
        const el = scrollRef.current;
        if (el) {
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 2; // The multiplier can be adjusted for faster/slower scrolling
            el.scrollLeft = scrollLeft - walk;
        }
    };


    return (
<>
        <div  className=' '>
           
            <div   ref={scrollRef}
            onMouseDown={mouseDownHandler}
            onMouseLeave={mouseLeaveHandler}
            onMouseUp={mouseUpHandler}
            onMouseMove={mouseMoveHandler}
            style={{
                width: '100%',
                overflowX: 'hidden',
                cursor: 'grab', // Initial cursor
            }}>
                {132 > -1 ? (
                    <table >
                        <tr className="mb-2 p-2 text-center fw-bold " >
                        {Object.entries(Tabledata[0]).map(([key, value]) => (
                            <th className="px-2" style={{minWidth:'100px'}}>
                                <h5 className='text-capitalize'>
                                   {key}
                                </h5>
                            </th>
                            ))}
                        </tr>
                      
                            {Tabledata.map((script:any) => (
                                    <tr className=" mb-4 p-3   rounded-3 text-center tr-value  bg-light-green" style={{
                                        borderBottom:'5px white solid',
                                     height:'60px',
                                     padding:'0px 10px',
                                     borderRadius:'5px'
                                    }}>
                                    {Object.entries(script).map(([key, value]:any) => (
                                        <td className="px-2">
                                            <span className="fw-bold fs-6">
                                      
                                                {value}
                                            </span>
                                        </td>))}
                                    </tr>
                               
                            ))}
                         
                    </table>
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
