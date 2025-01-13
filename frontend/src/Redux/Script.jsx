// src/api/ScriptApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './customBaseQuery';
import { endpoint } from './endpoint';

const ScriptApi = createApi({
  reducerPath: 'ScriptApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL, // Base URL from environment variables
  }),
  tagTypes: ['Script'],

  endpoints: (builder) => ({
    // Create script
    createScript: builder.mutation({
      query: ({ token, data }) => ({
        url: 'api/scripts',
        method: 'POST',
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Script'],
    }),

    // Get all scripts with pagination
    getAllScript: builder.query({
      query: ({ token, page_no, page_size }) => ({
        url: `getall?page_no=${page_no}&page_size=${page_size}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Script'],
    }),

    // Remove multiple scripts
    removeScript: builder.mutation({
      query: ({ token, ids }) => ({
        url: `removeMultiple`,
        method: 'DELETE',
        data: ids, // Axios uses `data` for request bodies in DELETE requests
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Script'],
    }),

    // Filter scripts by category
    filterScript: builder.query({
      query: ({ token, value }) => ({
        url: `${endpoint.scripts}?category=${value}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Search scripts
    searchScript: builder.mutation({
      query: ({ token, value }) => ({
        url: `${endpoint.search}${value}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Update script
    updateScript: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoint.scripts}/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Script'],
    }),
  }),
});

export const {
  useCreateScriptMutation,
  useFilterScriptQuery,
  useGetAllScriptQuery,
  useRemoveScriptMutation,
  useSearchScriptMutation,
  useUpdateScriptMutation,
} = ScriptApi;
export default ScriptApi;
