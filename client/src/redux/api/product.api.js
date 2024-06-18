import { api } from "./index.js";

const baseProductEndpoint = "/product";

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

export const { useGetProductsQuery, useGetProductDetailQuery } = productApi;
