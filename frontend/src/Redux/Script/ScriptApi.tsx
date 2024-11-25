// src/api/scriptsApi.js
import axiosInstance from "../APInterceptors";
import { endpoint } from "../endpoint";

// Create Script
export const CreateScript = async (data: any) => {
  const { formData } = data;
  try {
    const response = await axiosInstance.post(endpoint.scripts, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Script
export const UpdateScript = async (data: any) => {
  const { formData, scriptId } = data;
  try {
    const response = await axiosInstance.patch(
      `scripts/upload/${scriptId}/`,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Script by ID
export const GetScriptByID = async (data: any) => {
  const { id } = data;
  try {
    const response = await axiosInstance.get(`${endpoint.scripts}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete Script by ID
export const DeleteScriptByID = async (data: any) => {
  const { id } = data;
  try {
    const response = await axiosInstance.delete(`${endpoint.scripts}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get All Scripts
export const GetAllScript = async () => {
  try {
    const response = await axiosInstance.get(`${endpoint.scripts}?page=1`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Scripts by Category
export const GetScriptbyCategory = async (data: any) => {
  const { value } = data
  try {
    const response = await axiosInstance.get(
      `${endpoint.scripts}?page=1&category=${value?.category}&subcategory1=${value?.category1}&subcategory2=${value?.category2}&status=success `
    );
    return response;
  } catch (error) {
    throw error;
  }
};
// Get status Script by ID
export const GetSatusScriptByID = async (data:any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.get(
      `${endpoint.scripts}/${id}/status`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
// Run Script
export const RunScript = async (data: any) => {
  const { id } = data;
  try {
    const response = await axiosInstance.post(`${endpoint.scripts}/${id}/run`);
    return response;
  } catch (error) {
    throw error;
  }
};
