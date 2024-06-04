import axiosBaseQuery from "@/utils/axios.util.js";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",

  baseQuery: axiosBaseQuery({
    baseUrl: "/category",
  }),
  
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
