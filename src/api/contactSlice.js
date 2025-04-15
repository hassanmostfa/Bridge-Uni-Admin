import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.bridgeuni.com/api";

// Create the API slice using RTK Query
export const contactApi = createApi({
  reducerPath: "contactApi",
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
    getAllContacts: builder.query({
      query: () => '/contactUs',
    }),
    getContact: builder.query({
      query: (id) => '/contactUs/' + id,
    }),
    addContact: builder.mutation({
      query: (data) => ({
        url: "/contactUs",
        method: "POST",
        body: data,
      }),
    }),
    updateContact: builder.mutation({
      query: ({ id, data }) => ({
        url: `/contactUs/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contactUs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks generated by the API service
export const {
  useGetAllContactsQuery,
  useGetContactQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation
} = contactApi;
