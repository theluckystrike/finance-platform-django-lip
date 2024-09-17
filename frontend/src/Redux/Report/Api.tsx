import axios from "axios";
import { endpoint } from "../endpoint";

export const CreateScript = async (data: any) => {
  const { formData, token } = data;

  try {
    // Set up headers with the Bearer token
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}scripts/upload/`,
      formData,
      { headers }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



export const GetAllScript = async (data: any) => {
  const {token } = data;

  try {
    // Set up headers with the Bearer token
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${endpoint.scripts}`,
      { headers }
    );
 

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const RunScript = async (data: any) => {
  const {token } = data;

  try {
    // Set up headers with the Bearer token
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request with headers
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}scripts/`,
      { headers }
    );

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};