import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({ baseUrl:process.env.REACT_APP_API_URL }),
  tagTypes: ['Post', 'Project'],
  endpoints: (builder) => ({

    createProject: builder.mutation({
      query: ({ token, project }) => ({
        url: '/create',
        method: 'POST',
        headers: {
          'x-access-token': token
        },
        body: project,
      }),
      invalidatesTags: ['Post']
    }),

    getAllProject: builder.query({
      query: ({ token, page_no, page_size }) => ({
        url: `/getall?page_no=${page_no}&page_size=${page_size}`,
        method: 'GET',
        headers: {
          'x-access-token': token
        },
      }),
      providesTags: ['Post']
    }),

    updateProject: builder.mutation({
      query: ({ id, token, data }) => ({
        url: `/update/${id}`,
        method: 'PUT',
        headers: {
          'x-access-token': token
        },
        body: data,
      }),
      invalidatesTags: ( { id }) => [
        'Post',
        { type: 'Project', id },
      ],
    }),

    deleteProject: builder.mutation({
      query: ({ id, token }) => ({
        url: `/remove/${id}`,
        method: 'DELETE',
        headers: {
          'x-access-token': token
        },
      }),
      invalidatesTags: ['Post']
    }),
    deleteMultipleProject: builder.mutation({
        query: ({  ids ,token}) => ({
          url: `/removeMultiple`,
          method: 'DELETE',
          headers: {
            'x-access-token': token
          },
          body:ids
        }),
        invalidatesTags: ['Post']
      }),
    sortProject: builder.query({
      query: ({ order, token }) => ({
        url: `/sortByName?order=${order}`,
        method: 'GET',
        headers: {
          'x-access-token': token
        },
      }),
      providesTags: ['Post']
    }),

    getProjectById: builder.query({
      query: ({ id }) => ({
        url: `/getById/${id}`,
        method: 'GET',
        headers: {
          'x-access-token': 'token'
        },
      }),
      providesTags: ( { id }) => [{ type: 'Project', id }],
    }),
       // SEARCH Project
       searchProject:builder.query({
        query:(projectName)=>({
            url:`search?projectName=${projectName}`,
            method:'GET',

        })
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useSortProjectQuery,
  useGetProjectByIdQuery,
  useDeleteMultipleProjectMutation,
  useSearchProjectQuery
} = projectApi;

export default projectApi;
