import React, { useEffect, useState } from 'react';
import { ReactComponent as Logo } from '../../assest/svg/logo_text_image_white.svg';
import { ActiveRoute, SidebarMenu } from '../../Menu';
import Icon from '../ui/icon/Icon';
import dummyUser from '../../assest/image/logo/user.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useToast from '../../customHook/toast';
import { MenuItem } from '../../types/MenuTypes';
import { GetRole, loginUSer } from '../../customHook/getrole';
import { useSignOutMutation } from '../../Redux/AuthSlice';
const Sidebar = () => {
  const admin = GetRole();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const [filterScriptQuery, setFilterScriptQuery] = useState<any>(null);

  useEffect(() => {
    let filterQuery: any = localStorage.getItem('filterquery');
    if (filterQuery) {
      filterQuery = JSON.parse(filterQuery);
      setFilterScriptQuery(filterQuery);
    } else {
      setFilterScriptQuery(false);
    }
  }, [location]);

  const changeRoute = (value: String) => {
    if (value.includes('allscripts') && filterScriptQuery) {
      navigate(
        `/filter-scripts?category=${filterScriptQuery.parentName}&subcategory1=${filterScriptQuery.parentName1}&subcategory2=${filterScriptQuery.parentName2}`
      );
    } else {
      navigate(`${value}`);
    }
  };

  const [signout, Res] = useSignOutMutation();
  const logout = async () => {
    await signout({ token: loginUSer });
    localStorage.removeItem('login');
    navigate('/');
    toast.InfoToast('Logout successful');
  };
  return (
    <div className="bg-green text-light vh-100 d-flex flex-column w-100">
      <div className="d-flex justify-content-center">
        <Logo className="icon" width={160} height={70} />
      </div>
      <div className="d-flex justify-content-center">
        <ul className="sidebar-menu fw-bold">
          {Object.entries(SidebarMenu).map(([key, value]: any) => (
            <li
              onClick={() => changeRoute(value.path)}
              key={key}
              style={{ cursor: 'pointer' }}
              className={`row justify-content-evenly align-items-center ${
                value?.hide ? 'd-none' : ''
              }
              ${admin !== value?.role && value?.role !== 'all' ? 'd-none' : ''}
              `}
            >
              <div className="col-3">
                <Icon icon={value.icon} size="20px" color="dark" />
              </div>
              <div className="col-9 text-start">{value.name}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-user-div pb-2 d-flex justify-content-center mt-auto">
        <div className="user-profile-logo dropdown">
          <div
            className=""
            style={{
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img src={dummyUser} alt="" width={60} height={60} />
          </div>
          <div
            className="dropdown-menu text-center fw-bold"
            aria-labelledby="dropdownMenuButton"
          >
            <Link
              to={`/${ActiveRoute.UserProfile.path}`}
              className="dropdown-item"
            >
              Profile
            </Link>
            <a
              className="dropdown-item"
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_ADMIN_URL}`;
              }}
            >
              Admin Portal
            </a>
            <button className="dropdown-item" onClick={logout}>
              Sign Out
            </button>

            <div className="divss"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
