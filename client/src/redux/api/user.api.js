import { api } from "./index.js";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "/user/profile",
      }),
      keepUnusedDataFor: 0,
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        data,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
