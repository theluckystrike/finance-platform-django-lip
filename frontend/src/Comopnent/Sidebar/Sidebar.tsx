import React from 'react';
import { ReactComponent as Logo } from '../../assest/svg/logo_text_image_white.svg';
import { SidebarMenu } from '../../Menu';
import Icon from '../ui/icon/Icon';
import dummyUser from '../../assest/image/logo/user.jpg'
import {  useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const navigate= useNavigate()
  
  const changeRoute = (value:String)=>{
    navigate(`${value}`)
  }
  return (
    <div className='bg-green text-light vh-100 d-flex flex-column'>
      <div className='d-flex justify-content-center'>
        <Logo className="icon" width={160} height={70} />
      </div>
      <div className='d-flex justify-content-center'>
        <ul className='sidebar-menu fw-bold'>
          {Object.entries(SidebarMenu).map(([key, value]) => (
        

            <li onClick={()=>changeRoute(value.path)} key={key} className='row justify-content-evenly align-items-center'>
            <div className='col-3'>
            <Icon icon={value.icon} size='20px' color='dark' />
            </div>
            <div className='col-9 text-start'>
            {value.name}
            </div>
            </li>
      
          ))}
        </ul>
      </div>
    
    
      <div className="profile-user-div pb-2 d-flex justify-content-center mt-auto">
  <div className="user-profile-logo dropdown">
    <div
      className=""
      style={{borderRadius:'50%',overflow:'hidden'}}
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <img src={dummyUser} alt="" width={60} height={60} />
    </div>
    <div className="dropdown-menu text-center fw-bold"  aria-labelledby="dropdownMenuButton">
      <a className="dropdown-item" href="#">
        Profile
      </a>
      <a className="dropdown-item" href="#">
        Settings
      </a>
      <a className="dropdown-item" href="#">
        Sign Out
      </a>
      <div className='divss'></div>
    </div>
  </div>
</div>

    </div>
  );
}

export default Sidebar;
