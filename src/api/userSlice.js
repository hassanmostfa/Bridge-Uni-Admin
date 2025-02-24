import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.biopluskw.com/api/v1"; // Replace with your actual base URL

// Function to create request
const createRequest = (url) => ({ url });

// Create the API slice using RTK Query
export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Get the token from localStorage (or Redux state)
      const token = localStorage.getItem("token");

      // If a token exists, add it to the headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Example login request (modify this as per your API endpoint)
    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: "/auth/login",
        method: "POST",
        body: userCredentials, // Sending user credentials (email and password)
      }),
    }),
    getAdmins: builder.query({
      query: () => createRequest("/admin/admin-user"),
    }),
    // You can add more endpoints here as needed
    getUserProfile: builder.query({
      query: (userId) => createRequest(`/admin/admin-user/${userId}`),
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "/admin/admin-user",
        method: "POST",
        body: user,
      }),
    }),

    updateUser: builder.mutation({
      query: ({id, user}) => ({
        url: `/admin/admin-user/${id}`,
        method: "PUT",
        body: user,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/admin-user/${id}`,
        method: "DELETE",
      }),
    })
  }),
});

// Export hooks generated by the API service
export const { useLoginUserMutation, useGetUserProfileQuery, useGetAdminsQuery , useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation} = apiService;
