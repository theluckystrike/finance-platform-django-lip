import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ScriptApi = createApi({
    reducerPath: 'ScriptApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    tagTypes: ['Script'],

    endpoints: (builder) => ({
        // create
        createScript: builder.mutation({
            query: ({ token, data }) => ({
                url: 'create',
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json',
                },
                body: data,
            }),
            invalidatesTags: ['Script'],
        }),

        getAllScript : builder.query({
            query: ({token,page_no,page_size}) => ({
                url: `getall?page_no=${page_no}&page_size=${page_size}`,
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json',
                },
            }),
            providesTags: ['Script'],
        }),

         // removeScript
         removeScript:builder.mutation({
            query:({token,ids})=>({
                
                url: `removeMultiple`,
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json', // Ensure proper content type
                },
                body: ids
                
            }),
            invalidatesTags: ['Script'],

        }),

        // search
        searchScript:builder.query({
            query:({token,name})=>({
                
                url: `search?Name=${name}`,
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json', // Ensure proper content type
                },
               
                
            }),
            
        }),
        updateScript: builder.mutation({
            query: ({ id, data, token }) => ({
              url: `update/${id}`,
              method: 'PUT',
              headers: {
                'x-access-token': token,
                'Content-Type': 'application/json', // Ensure proper content type
              },
              body: data,
            }),
            invalidatesTags: [{ type: 'Script'}],
          }),
     
       
    }),
});

export const { useCreateScriptMutation,
               useGetAllScriptQuery,
               useRemoveScriptMutation,
               useSearchScriptQuery,
               useUpdateScriptMutation
            } = ScriptApi;
export default ScriptApi;
