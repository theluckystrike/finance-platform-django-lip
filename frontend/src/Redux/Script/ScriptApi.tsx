// src/api/scriptsApi.js
import axiosInstance from '../APInterceptors';
import { endpoint } from '../endpoint';

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
      formData,
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
export const GetAllScript = async ({ page = 1, per_page, query = '' }: any) => {
  try {
    const response = await axiosInstance.get(
      `${endpoint.scripts}?page=${page}&per_page=${per_page}&${query}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
// Get Scripts by Category
export const GetScriptbyCategory = async (data: any) => {
  const { value } = data;
  try {
    // Build query parameters dynamically
    const params = new URLSearchParams();
    params.append('page', '1');
    
    if (value?.category) params.append('category', value.category);
    if (value?.category1) params.append('subcategory1', value.category1);
    if (value?.category2) params.append('subcategory2', value.category2);
    
    // Handle new problems/stale_hours parameters
    if (value?.problems) {
      params.append('problems', value.problems);
      if (value?.stale_hours) {
        params.append('stale_hours', value.stale_hours);
      }
    } else if (value?.status && value.status !== '') {
      // Only use status filter if not using problems filter
      params.append('status', value.status === 'all' ? '' : value.status);
    }
    
    const response = await axiosInstance.get(
      `${endpoint.scripts}?${params.toString()}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
// Get status Script by ID
export const GetSatusScriptByID = async (data: any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.get(
      `${endpoint.scripts}/${id}/status`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
// Run Script
export const RunScript = async ({ id }: any) => {
  try {
    const response = await axiosInstance.post(`${endpoint.scripts}/${id}/run`);
    return response;
  } catch (error) {
    throw error;
  }
};
