import { ENDPOINT } from "@/constants/index.js";
import { api } from "./index.js";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    authUser: builder.query({
      query: () => ({
        url: ENDPOINT.AUTH,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    authGoogle: builder.mutation({
      query: (data) => ({
        url: ENDPOINT.AUTH + "/google",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: ENDPOINT.AUTH + "/login",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    register: builder.mutation({
      query: (data) => ({
        url: ENDPOINT.AUTH + "/register",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: ENDPOINT.AUTH + "/logout",
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
  useAuthGoogleMutation,
} = authApi;
