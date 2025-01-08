// src/api/reportsApi.js
import axios from 'axios';
import axiosInstance from '../APInterceptors'; // Adjust the import path if necessary
import { endpoint } from '../endpoint';

// Create Report
export const Createreport = async (data: any) => {
  const { values } = data;

  try {
    const response = await axiosInstance.post(endpoint.reports, values);
    return response;
  } catch (error) {
    throw error;
  }
};

// Merge Report
export const mergereport = async (data: any) => {
  const { values } = data;

  try {
    const response = await axiosInstance.post(
      `${endpoint.reports}/merge`,
      values,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Report
export const Updatereport = async (data: any) => {
  const { values, id } = data;

  try {
    const response = await axiosInstance.put(
      `${endpoint.reports}/${id}`,
      values,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Report by ID
export const GetreportByID = async (data: any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.get(`${endpoint.reports}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get All Reports
export const GetAllreport = async () => {
  try {
    const response: { count: number; results: [] } = await axiosInstance.get(
      `${endpoint.reports}?page=1`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Run Report
export const Runreport = async () => {
  try {
    const response = await axiosInstance.get('reports/');
    return response;
  } catch (error) {
    throw error;
  }
};

// Create Report Schedules
export const Createreportschedules = async (data: any) => {
  const { values } = data;

  try {
    const response = await axiosInstance.post(endpoint.reportschedules, values);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete Report by ID
export const DeleteReportsByID = async (data: any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.delete(`${endpoint.reports}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Reports
export const UpdateReports = async (data: any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.post(
      `${endpoint.reports}/${id}/update`,
      {
        run_scripts: false,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Get status Report by ID
export const GetSatusreportByID = async (data: any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.get(
      `${endpoint.reports}/${id}/status`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
