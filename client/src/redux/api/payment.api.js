import { ENDPOINT } from "@/constants/index.js";
import { api } from "./index.js";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${ENDPOINT.PAYMENT}/payment-intent`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
