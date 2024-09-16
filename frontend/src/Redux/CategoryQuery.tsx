import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoint } from './endpoint';

const api = createApi({
  reducerPath: 'Categoryapi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_LOCAL_URL }),
  tagTypes: ['GET', 'Category'],
  endpoints: (builder) => ({
    create: builder.mutation({
      query: ({ token, data }) => ({
        url: `${endpoint.category}`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),
   
    update: builder.mutation({
      query: ({ token,id, data }) => ({
        url: `${endpoint.category}/${id}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),
    remove: builder.mutation({
      query: ({ token,id }) => ({
        url: `${endpoint.category}/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        } 
       
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),
      getAllCategory: builder.query({
      query: ({ token }) => ({
        url: endpoint.category,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
         },
         
      }),
      providesTags: ['Category']
    }),
    
     
    }),
  })
 

export const { 
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useGetAllCategoryQuery,
} = api;
export default api;
