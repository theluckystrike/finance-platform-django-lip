import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoint } from './endpoint';
import { getToken } from '../utils/localStorage';
export interface Category {
  id: number;
  level: number;
  name: string;
  parent_category: number | null;
}

const api = createApi({
  reducerPath: 'Categoryapi',
  baseQuery: async (args, api, extraOptions) => {
    const token = getToken();
    const headers = {
      ...args.headers,
      Authorization: `Bearer ${token}`,
    };
    return fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL })(
      { ...args, headers },
      api,
      extraOptions,
    );
  },
  tagTypes: ['GET', 'Category'],
  endpoints: (builder) => ({
    create: builder.mutation({
      query: ({ token, data }) => ({
        url: `${endpoint.category}`,
        method: 'POST',
        body: data,
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),

    update: builder.mutation({
      query: ({ token, id, data }) => ({
        url: `${endpoint.category}/${id}`,
        method: 'PUT',
        body: data,
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),
    remove: builder.mutation({
      query: ({ token, id }) => ({
        url: `${endpoint.category}/${id}`,
        method: 'DELETE',
      }),
      // Optionally, you can add invalidatesTags here if needed
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: endpoint.category,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useGetAllCategoryQuery,
} = api;
export default api;
