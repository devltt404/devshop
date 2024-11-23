import { ENDPOINT } from "@/constants/index.js";
import { api } from "./index.js";

const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSimpleCart: builder.query({
      query: () => ({
        url: ENDPOINT.CART + "/simple",
        method: "GET",
      }),
      providesTags: ["SIMPLE_CART"],
    }),

    getDetailedCart: builder.query({
      query: () => ({
        url: ENDPOINT.CART + "/detail",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["CART"],
    }),

    addToCart: builder.mutation({
      query: ({ productId, skuId, quantity }) => ({
        url: ENDPOINT.CART + "/item",
        method: "POST",
        data: { productId, skuId, quantity },
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    removeCartItem: builder.mutation({
      query: ({ productId, skuId }) => ({
        url: ENDPOINT.CART + "/item",
        method: "DELETE",
        data: { productId, skuId },
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    updateCartItemQuantity: builder.mutation({
      query: ({ productId, skuId, quantity }) => ({
        url: ENDPOINT.CART + "/item-quantity",
        method: "PUT",
        data: { productId, skuId, quantity },
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: ENDPOINT.CART + "/all-items",
        method: "DELETE",
      }),
      invalidatesTags: ["SIMPLE_CART", "CART"],
    }),
  }),
});

export const {
  useGetSimpleCartQuery,
  useAddToCartMutation,
  useGetDetailedCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
  useClearCartMutation,
} = cartApi;
