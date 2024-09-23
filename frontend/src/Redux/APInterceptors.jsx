// src/api/axiosInstance.js
import axios from 'axios';
 
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
    config.headers['Content-Type'] = 'multipart/form-data';
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
 
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
