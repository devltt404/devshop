import { api } from "./index.js";

const baseOrderEndpoint = "/order";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: (orderId) => ({
        url: `${baseOrderEndpoint}/${orderId}`,
      }),
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: `${baseOrderEndpoint}/user`,
      }),
      providesTags: ["ORDERS"],
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: baseOrderEndpoint,
        method: "POST",
        data,
      }),
      invalidatesTags: ["ORDERS"],
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

export const {
  useGetOrderQuery,
  useCreateOrderMutation,
  useAuthorizeOrderMutation,
  useGetUserOrdersQuery,
} = orderApi;
