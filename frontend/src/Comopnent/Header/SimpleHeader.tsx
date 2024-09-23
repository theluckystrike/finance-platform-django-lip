

import React, { useEffect, useState } from 'react';
import '../../assest/css/Header.css';
 
import Icon from "../ui/icon/Icon";
import { useSearchScriptMutation } from '../../Redux/Script';
import { loginUSer } from '../../customHook/getrole';
import { Link } from 'react-router-dom';
import Loader from '../ui/Loader';
 

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
    <div className='bg-green main-header-conatiner'>
      <div className='search-bar-conatiner'>
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
