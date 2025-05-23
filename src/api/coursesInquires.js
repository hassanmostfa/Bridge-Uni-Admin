import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.bridgeuni.com/api";

// Create the API slice using RTK Query
export const CoursesInquiresApi = createApi({
  reducerPath: "CoursesInquiresApi",
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
    // GET Endpoints
    getOnlineCourseInquiries: builder.query({
      query: () => ({
        url: "/courseInquiry/onlineCourse",
        method: "GET",
      }),
    }),
    getShortCourseInquiries: builder.query({
      query: () => ({
        url: "/courseInquiry/shortCourse",
        method: "GET",
      }),
    }),
    getStudyAbroadInquiries: builder.query({
      query: () => ({
        url: "/courseInquiry/studyAbroad",
        method: "GET",
      }),
    }),

    // DELETE Endpoints
    deleteOnlineCourseInquiry: builder.mutation({
      query: (id) => ({
        url: `/courseInquiry/onlineCourse/${id}`,
        method: "DELETE",
      }),
    }),
    deleteShortCourseInquiry: builder.mutation({
      query: (id) => ({
        url: `/courseInquiry/shortCourse/${id}`,
        method: "DELETE",
      }),
    }),
    deleteStudyAbroadInquiry: builder.mutation({
      query: (id) => ({
        url: `/courseInquiry/studyAbroad/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks generated by the API service
export const {
  useGetOnlineCourseInquiriesQuery,
  useGetShortCourseInquiriesQuery,
  useGetStudyAbroadInquiriesQuery,
  useDeleteOnlineCourseInquiryMutation,
  useDeleteShortCourseInquiryMutation,
  useDeleteStudyAbroadInquiryMutation,
} = CoursesInquiresApi;
