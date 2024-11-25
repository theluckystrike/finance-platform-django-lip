// src/api/axiosInstance.js
import axios from 'axios';
import { toast, ToastOptions, ToastPosition, TypeOptions } from 'react-toastify';
import { endpoint } from './endpoint';
 
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Base URL of the API
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach the token to every request
    const storedLoginUser = localStorage.getItem("login");
    const token = JSON.parse(storedLoginUser)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token?.access}`;
    }
    if (config.url === endpoint.reports || config.url === endpoint.summaries  ||config.url === endpoint.scripts  ) {
      config.headers['Content-Type'] = 'application/json';  // For Createreport
    } else {
      config.headers['Content-Type'] = 'multipart/form-data';  // For others
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
 
    
    // You can handle global errors here (e.g., logging out user on 401)
    if (error.response && error.response.status === 401) {
      toast('Your session has expired. Please log in again.', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
     
       // Use window.history.pushState to change the URL without reloading the page
       window.history.pushState({}, '', '/login');

       // Optionally, trigger a popstate event to let React Router handle the change
       window.dispatchEvent(new PopStateEvent('popstate'));
     
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
