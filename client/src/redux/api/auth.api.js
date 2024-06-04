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
    }),

    register: builder.mutation({
      query: (data) => ({
        url: baseAuthEndpoint + "/register",
        method: "POST",
        data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: baseAuthEndpoint + "/logout",
        method: "POST",
      }),
    }),
  }),
});


export const {
  useAuthUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
