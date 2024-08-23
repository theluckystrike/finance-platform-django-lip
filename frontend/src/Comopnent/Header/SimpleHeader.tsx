

import React, { useState } from 'react';
import '../../assest/css/Header.css';
import { ScriptData } from '../../DummyData/TableData';
import SearchIcon from '../../assest/image/search-icon.svg';

const SimpleHeader = () => {
  const [searchData, setSearchData] = useState<any>([]);

  const handleSearch = (e: any) => {
    const value = e.target.value.toLowerCase();

    if (value === '') {
      setSearchData([]);  // Clear search data if input is empty
    } else {
      const res: any = ScriptData.filter((i) =>
        i.title?.toLowerCase().includes(value)
      );
      setSearchData(res);
    }
  };

  return (
    <div className='bg-green main-header-conatiner'>
      <div className='search-bar-conatiner'>
	  <div className="search_icon">
				<img src={SearchIcon} alt="" />
			  </div>
        <input 
          type="text" 
          placeholder='Search' 
          className='bg-light' 
          onChange={handleSearch} 
        />

        {searchData.length > 0 && (
          <div 
            className="dropdown-content" 
            style={{
              display: 'block', 
              maxWidth: '70%',
              top: '60px'
            }}
          >
            {searchData.map((item: any, index: any) => (
              <span className="hover-span" key={index}>
                {item?.title}
              </span>
            ))}
          </div>
        )}
      </div> 
    </div>
  );
};

export default SimpleHeader;
