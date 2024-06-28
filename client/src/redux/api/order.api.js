import { api } from "./index.js";

const baseOrderEndpoint = "/order";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: baseOrderEndpoint,
        method: "POST",
        data,
      }),
    }),

    authorizeOrder: builder.mutation({
      query: ({ orderId, paymentId }) => ({
        url: `${baseOrderEndpoint}/authorize/${orderId}`,
        method: "POST",
        data: { paymentId },  
      }),
      
    }),
  }),
});

export const { useCreateOrderMutation, useAuthorizeOrderMutation } = orderApi;
