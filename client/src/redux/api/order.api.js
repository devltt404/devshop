import { ENDPOINT } from "@/constants/index.js";
import { api } from "./index.js";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderDetail: builder.query({
      query: (orderId) => ({
        url: `${ENDPOINT.ORDERS}/${orderId}`,
      }),
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: `${ENDPOINT.ORDERS}/user`,
      }),
      providesTags: ["ORDERS"],
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: ENDPOINT.ORDERS,
        method: "POST",
        data,
      }),
      invalidatesTags: ["ORDERS"],
    }),

    authorizeOrder: builder.mutation({
      query: ({ orderId, paymentId }) => ({
        url: `${ENDPOINT.ORDERS}/authorize/${orderId}`,
        method: "POST",
        data: { paymentId },
      }),
    }),
  }),
});

export const {
  useGetOrderDetailQuery,
  useCreateOrderMutation,
  useAuthorizeOrderMutation,
  useGetUserOrdersQuery,
} = orderApi;
