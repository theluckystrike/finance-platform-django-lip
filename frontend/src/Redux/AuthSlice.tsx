// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
// import { login } from '../models'; // Replace with your actual model definition

// export const AuthSlice = createApi({
//   reducerPath: 'AuthSlice',
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://clearstub-api.cradle.services/api/user/' }),
//   endpoints: (builder) => ({
//     createLogin: builder.mutation<login, login>({
//       query: (data) => ({
//         url: '/login',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//   }),
// });

// export const { useCreateLoginMutation } :any= AuthSlice; // Ensure correct export
// src/services/apiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoint } from './endpoint';

const api = createApi({
  reducerPath: 'api',
  tagTypes: ['GET', 'Project'],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_LOCAL_URL  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: endpoint.login,
        method: 'POST',
        body: credentials,
      }),
    }),

    forgotpassword: builder.mutation({
      query:(email)=>({
        url:'/forgetPassword',
        method:'POST',
        body:email
      })
    }),

    verifypasswordotp:builder.mutation({
      query:(otp)=>({
        url:'/verifyPasswordOtp',
        method:'POST',
        body:otp
      })
    }),

    changePassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: '/resetPassword',
        method: 'POST',
        headers: {
          'x-access-token': token, // No need for `${token}`, unless it's specifically required
        },
        body: {
          password: newPassword, // Ensure this matches the API endpoint's expected structure
        },
      }),
    }),
    

    getuserbytoken: builder.query({
      query: ({ token, page_no, page_size }) => ({
        url: endpoint.getuserinfo,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Ensure the Bearer token is correctly formatted
        },
        params: {  // If you need pagination, include these as query parameters
          page: page_no,
          size: page_size,
        },
      }),
      providesTags: ['GET']
    }),
    
  
  }),
});

export const { useLoginMutation,useForgotpasswordMutation,useGetuserbytokenQuery,useVerifypasswordotpMutation,useChangePasswordMutation } = api;
export default api;
