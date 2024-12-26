// src/api/summariesApi.js
import axios from 'axios';
import axiosInstance from '../APInterceptors'; // Adjust the import path if necessary
import { endpoint } from '../endpoint';

// Create summery
export const Createsummery = async (data:any) => {
  const { values } = data;
 console.log(values,'1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/');
 

  try {
    const response = await axiosInstance.post(
      endpoint.summaries,
      values
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Merge summery
export const mergesummery = async (data:any) => {
  const { values } = data;

  try {
    const response = await axiosInstance.post(
      `${endpoint.summaries}/merge`,
      values
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update summery
export const Updatesummery = async (data:any) => {
  const { values, id } = data;

  try {
    const response = await axiosInstance.put(
      `${endpoint.summaries}/${id}`,
      values
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Get summery by ID
export const GetsummeryByID = async (data:any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.get(
      `${endpoint.summaries}/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Get All summaries
export const GetAllsummery = async () => {
  try {
    const response = await axiosInstance.get(
      `${endpoint.summaries}?page=1`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Run summery
export const Runsummery = async () => {
  try {
    const response = await axiosInstance.get('summaries/');
    return response;
  } catch (error) {
    throw error;
  }
};

 

// Delete summery by ID
export const DeletesummariesByID = async (data:any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.delete(
      `${endpoint.summaries}/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update summaries
export const Updatesummaries = async (data:any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.post(
      `${endpoint.summaries}/${id}/update`,
      {
        run_scripts: false,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
 

// Get status summery by ID
export const GetSatussummeryByID = async (data:any) => {
  const { id } = data;

  try {
    const response = await axiosInstance.get(
      `${endpoint.summaries}/${id}/status`
    );
    return response;
  } catch (error) {
    throw error;
  }
};