import React from 'react';
import '../../assest/css/Header.css';
import SearchIcon from '../../assest/image/search-icon.svg';
const SimpleHeader = () => {
  return (
	  <div className='bg-green  main-header-conatiner'>
		  
		  <div className='search-bar-conatiner'>
			  <div className="search_icon">
				<img src={SearchIcon} alt="" />
			  </div>
<input type="text" placeholder='Search' className='bg-light' />

	 </div> 


	</div>
  )
}

export default SimpleHeader