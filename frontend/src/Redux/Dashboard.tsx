import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ["Dashboard"],

  endpoints: (builder) => ({
    // create
    createDashboard: builder.mutation({
      query: ({ token, data }) => ({
        url: "create",
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Dashboard"],
    }),

    getAllDashboard: builder.query({
      query: ({ token, page_no, page_size }) => ({
        url: `getall?page_no=${page_no}&page_size=${page_size}`,
        method: "GET",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Dashboard"],
    }),

    // removeDashboard
    removeDashboard: builder.mutation({
      query: ({ token, ids }) => ({
        url: `removeMultiple`,
        method: "DELETE",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json", // Ensure proper content type
        },
        body: ids,
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // search
    searchDashboard: builder.query({
      query: ({ token, name }) => ({
        url: `search?Name=${name}`,
        method: "GET",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json", // Ensure proper content type
        },
      }),
    }),
    updateDashboard: builder.mutation({
      query: ({ id, data, token }) => ({
        url: `update/${id}`,
        method: "PUT",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json", // Ensure proper content type
        },
        body: data,
      }),
      invalidatesTags: [{ type: "Dashboard" }],
    }),
  }),
});

export const {
  useCreateDashboardMutation,
  useGetAllDashboardQuery,
  useRemoveDashboardMutation,
  useSearchDashboardQuery,
  useUpdateDashboardMutation,
} = dashboardApi;
export default dashboardApi;
