import { api } from "./index.js";

const baseProductEndpoint = "/products";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ ...params }) => ({
        url: baseProductEndpoint,
        method: "GET",
        params,
      }),
    }),
    getProductDetail: builder.query({
      query: ({ id }) => ({
        url: `${baseProductEndpoint}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProductDetailQuery, useGetProductsQuery } = productApi;
