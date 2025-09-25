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
  tagTypes: ['GET', 'Category', 'Script'],
  endpoints: (builder) => ({
    create: builder.mutation({
      query: ({ token, data }) => ({
        url: `${endpoint.category}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    update: builder.mutation({
      query: ({ token, id, data }) => ({
        url: `${endpoint.category}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    remove: builder.mutation({
      query: ({ token, id }) => ({
        url: `${endpoint.category}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
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
