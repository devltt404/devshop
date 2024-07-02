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

    authGoogle: builder.mutation({
      query: (data) => ({
        url: baseAuthEndpoint + "/google",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: baseAuthEndpoint + "/login",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    register: builder.mutation({
      query: (data) => ({
        url: baseAuthEndpoint + "/register",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: baseAuthEndpoint + "/logout",
        method: "POST",
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),
  }),
});

export const {
  useAuthUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useAuthGoogleMutation
} = authApi;
