import { ENDPOINT } from "@/constants/index.js";
import { api } from "./index.js";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: `${ENDPOINT.USERS}/profile`,
      }),
      keepUnusedDataFor: 0,
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${ENDPOINT.USERS}/profile`,
        method: "PATCH",
        data,
      }),
    }),

    updateUserPicture: builder.mutation({
      query: (data) => ({
        url: `${ENDPOINT.USERS}/picture`,
        method: "PUT",
        data,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPictureMutation,
} = userApi;
