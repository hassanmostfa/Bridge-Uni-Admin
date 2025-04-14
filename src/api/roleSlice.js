import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.biopluskw.com/api/v1";

// Create the API slice using RTK Query
export const roleApi = createApi({
  reducerPath: "roleApi",
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
    getRoles: builder.query({
      query: () => '/admin/role',
    }),
    getModules: builder.query({
      query: () => '/admin/module',
    }),
    addRole: builder.mutation({
      query: (role) => ({
        url: "/admin/role",
        method: "POST",
        body: role,
      }),
    }),
    getRolePermissios:builder.query({
        query:(id) => `/admin/role/${id}/permissions`
    }),

    updateRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/role/${id}`,
        method: "PUT",
        body: role,
      }),
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/admin/role/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks generated by the API service
export const {
  useGetRolesQuery,
  useGetModulesQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissiosQuery
} = roleApi;
