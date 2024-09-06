import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoint } from './endpoint';

const api = createApi({
  reducerPath: 'Categoryapi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_LOCAL_URL }),
  tagTypes: ['GET', 'Category'],
  endpoints: (builder) => ({
    create: builder.mutation({
      query: ({ token, data }) => ({
        url: `${endpoint.category}/create/`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),
   


      getAllCategory: builder.query({
      query: ({ token }) => ({
        url: endpoint.category+'/manager/',
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
  useGetAllCategoryQuery,
} = api;
export default api;
