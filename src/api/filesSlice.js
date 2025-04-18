import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.bridgeuni.com/api";

// Create the API slice using RTK Query
export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Get the token from localStorage (or Redux state)
      const token = localStorage.getItem("token");
      // If a token exists, add it to the headers
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
   
    addFile: builder.mutation({
      query: (data) => ({
        url: "/files/uploadFile",
        method: "POST",
        body: data,
      }),
    }),
    deleteFile: builder.mutation({
      query: (url) => ({
        url: `/files/${url}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks generated by the API service
export const {
    useAddFileMutation,
    useDeleteFileMutation
} = filesApi;
