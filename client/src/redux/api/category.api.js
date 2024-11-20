import { ENDPOINT } from "@/constants/index.js";
import { api } from "./index.js";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: ENDPOINT.CATEGORIES,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
