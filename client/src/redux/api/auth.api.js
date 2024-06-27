import { invalidateCartTagsAfterAuth } from "@/utils/cart.util.js";
import { api } from "./index.js";

const baseAuthEndpoint = "/auth";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    authUser: builder.query({
      query: () => ({
        url: baseAuthEndpoint,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    login: builder.mutation({
      query: (data) => ({
        url: baseAuthEndpoint + "/login",
        method: "POST",
        data,
      }),
      onQueryStarted: invalidateCartTagsAfterAuth,
    }),

    register: builder.mutation({
      query: (data) => ({
        url: baseAuthEndpoint + "/register",
        method: "POST",
        data,
      }),
      onQueryStarted: invalidateCartTagsAfterAuth,
    }),

    logout: builder.mutation({
      query: () => ({
        url: baseAuthEndpoint + "/logout",
        method: "POST",
      }),
      onQueryStarted: invalidateCartTagsAfterAuth,
    }),
  }),
});

export const {
  useAuthUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
