import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoint } from './endpoint';

const api = createApi({
  reducerPath: 'api',
  tagTypes: ['GET', 'Project'],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_LOCAL_URL  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: endpoint.auth+'login',
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
          'x-access-token': token, 
        },
        body: {
          password: newPassword, // Ensure this matches the API endpoint's expected structure
        },
       
      }),
    }),
    refreshtoken: builder.mutation({
      query: ({ token, page_no, page_size }) => ({
        url: endpoint.auth+'refresh-token',
        method: 'POST',
        body: {
          refresh: token,  
        },
      }),
      
    }),
    signout: builder.mutation({
      query: ({ token }) => ({
        url: endpoint.auth+'logout',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.access}`,
         },
        body: {
          refresh: token.refresh,  
        },
      }),
      
    }),
    getuserbytoken: builder.query({
      query: ({ token, page_no, page_size }) => ({
        url: endpoint.auth+'user-info',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
         },
        params: {
          page: page_no,
          size: page_size,
        },
      }),
      providesTags: ['GET']
    }),
    
  
  }),
});

export const { 
  useLoginMutation,
  useForgotpasswordMutation,
  useGetuserbytokenQuery,
  useRefreshtokenMutation,
  useSignoutMutation,
  useVerifypasswordotpMutation,
  useChangePasswordMutation 
} = api;
export default api;
