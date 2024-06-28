import { api } from "./index.js";

const basePaymentUrl = "/payment";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${basePaymentUrl}/payment-intent`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
