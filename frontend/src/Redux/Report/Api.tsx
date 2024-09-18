import axios from "axios";
import { endpoint } from "../endpoint";

export const Createreport = async (data: any) => {
  const { values, token } = data;
//console.log(values.scripts,'values');

  try {
    // Set up headers with the Bearer token
    const headers = {
 
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}${endpoint.reports}`,
      {
        name:values.name,
        scripts:[...values.scripts]
      },
      { headers }
    );

    return response;
  } catch (error) {
    //console.log(error);
    throw error;
  }
};
export const Updatereport = async (data: any) => {
  const { values, token ,id} = data;
 
 

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}${endpoint.reports}/${id}`,
        values,
      { headers }
    );

    return response;
  } catch (error) {
    //console.log(error);
    throw error;
  }
};

export const GetreportByID = async (data: any) => {
  const {token,id } = data;

  try {
    // Set up headers with the Bearer token
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${endpoint.reports}/${id}`,
      { headers }
    );
 

    return response;
  } catch (error) {
    //console.log(error);
    throw error;
  }
};

export const GetAllreport = async (data: any) => {
  const {token} = data;

  try {
    // Set up headers with the Bearer token
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${endpoint.reports}?page=1`,
      { headers }
    );
 

    return response;
  } catch (error) {
    //console.log(error);
    throw error;
  }
};


export const Runreport = async (data: any) => {
  const {token } = data;

  try {
    // Set up headers with the Bearer token
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}reports/`,
      { headers }
    );

    return response;
  } catch (error) {
    //console.log(error);
    throw error;
  }
};