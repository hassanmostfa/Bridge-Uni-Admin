import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.bridgeuni.com/api";

// Create the API slice for social endpoint
export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllSocial: builder.query({
      query: () => ({
        url: "/social",
        method: "GET",
      }),
    }),
    addSocial: builder.mutation({
      query: (data) => ({
        url: "/social",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks generated by the API service
export const {
  useGetAllSocialQuery,
  useAddSocialMutation,
} = socialApi;
