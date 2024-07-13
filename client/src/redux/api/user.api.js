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

    updateUserPicture: builder.mutation({
      query: (data) => ({
        url: "/user/picture",
        method: "PUT",
        data,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useUpdateUserPictureMutation } = userApi;
