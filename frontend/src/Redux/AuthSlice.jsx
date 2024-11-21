// src/api/AuthApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './customBaseQuery';
import { endpoint } from './endpoint';

const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL, // Base URL from environment variables
  }),
  tagTypes: ['Auth', 'User'],

  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: `${endpoint.auth}login`,
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/forgetPassword',
        method: 'POST',
        data: email,
      }),
    }),

    // Verify Password OTP
    verifyPasswordOtp: builder.mutation({
      query: (otp) => ({
        url: '/verifyPasswordOtp',
        method: 'POST',
        data: otp,
      }),
    }),

    // Change Password
    changePassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: '/resetPassword',
        method: 'POST',
        headers: {
          'x-access-token': token,
        },
        data: {
          password: newPassword,
        },
      }),
    }),

    // Refresh Token
    refreshToken: builder.mutation({
      query: ({ token }) => ({
        url: `${endpoint.auth}refresh-token`,
        method: 'POST',
        data: {
          refresh: token,
        },
      }),
    }),

    // Sign Out
    signOut: builder.mutation({
      query: ({ token }) => ({
        url: `${endpoint.auth}logout`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
        data: {
          refresh: token.refresh,
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Get User by Token
    getUserByToken: builder.query({
      query: ({ token, page_no, page_size }) => ({
        url: `${endpoint.auth}user-info`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page_no,
          size: page_size,
        },
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyPasswordOtpMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useSignOutMutation,
  useGetUserByTokenQuery,
} = AuthApi;

export default AuthApi;
