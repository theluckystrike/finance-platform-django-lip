

import React, { useEffect, useState } from 'react';
import '../../assest/css/Header.css';
 
import Icon from "../ui/icon/Icon";
import { useSearchScriptMutation } from '../../Redux/Script';
import { loginUSer } from '../../customHook/getrole';
import { Link } from 'react-router-dom';
import Loader from '../ui/Loader';
import Sidebar from '../Sidebar/Sidebar';
 

const SimpleHeader = () => {
  const [searchData, setSearchData] = useState<any>([]);
  const [searchScript, { isLoading,  data }]:any = useSearchScriptMutation();
  const handleSearch =async (e: any) => {
  const value=e.target.value.toLowerCase()


  if (value === '') {
    setSearchData([]);
  } else {
      await searchScript({value:value,token:loginUSer.access})
    } 
  };

  useEffect(()=>{
    if (data) {
    
      setSearchData(data?.scripts);
     }
  },[data])

  return (
    <div className='bg-green main-header-conatiner row '>

<div className='d-sm-flex d-md-none col-2 col-sm-2 text-light' style={{display:'flex', alignItems:'center'}}>
  

<button className="btn text-light " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
<Icon icon="Menu" size="40px" color="light"  />
</button>

<div className="offcanvas offcanvas-start" style={{width: '212px'}} data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <button type="button" style={{    position: 'absolute',
    top:' 3px',
    right:' 0px',
    color: 'white'}} className="btn " data-bs-dismiss="offcanvas" aria-label="Close"> <Icon icon="Close" size="20px" color="light"  /></button>
    <Sidebar/>
</div>


</div>
      <div className='col-sm-10 col-10 col-md-12   search-bar-conatiner'>
	  <div className="search_icon">
				{/* <img src={SearchIcon} alt="" /> */}
        {/* <SearchIcon/> */}

        <Icon icon="Search" size="35px" />
        
			  </div>
        <input 
          type="text" 
          placeholder='Search' 
          className='bg-light' 
          onChange={handleSearch} 
        />

        {searchData.length > 0    && (
          <div 
            className="dropdown-content" 
            style={{
              display: 'block', 
              maxWidth: '70%',
              maxHeight:'40vh',
              overflow:'auto',
              top: '60px'
            }}
          >
            {isLoading ? <Loader/>: (searchData && searchData.map((item: any, index: any) => (
              <Link  key={index} style={{textDecoration:'none'}}
              to={`/account/ScriptDetails/${item.id}`}>
              <span className="hover-span" >
                {item?.name}
              </span> 
              </Link>
            )))}
          </div>
        )}
      </div> 
    </div>
  );
};

export default SimpleHeader;
