import axiosBaseQuery from "@/utils/axios.util.js";
import { createApi } from "@reduxjs/toolkit/query/react";

export const auth = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/auth",
  }),
  endpoints: (builder) => ({
    authUser: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});
