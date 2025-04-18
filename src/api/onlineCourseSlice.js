import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.bridgeuni.com/api";

// Create the API slice using RTK Query
export const onlineCourseApi = createApi({
  reducerPath: "onlineCourseApi",
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
    getAllOnlineCources: builder.query({
      query: () => '/onlineCourse',
    }),
    getCourse: builder.query({
      query: (id) => '/onlineCourse/' + id,
    }),
    addCourse: builder.mutation({
      query: (data) => ({
        url: "/onlineCourse",
        method: "POST",
        body: data,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/onlineCourse/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/onlineCourse/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks generated by the API service
export const {
  useGetCourseQuery,
  useGetAllOnlineCourcesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation
} = onlineCourseApi;
