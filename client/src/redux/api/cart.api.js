import { api } from "./index.js";

const baseCartEndpoint = "/cart";

const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSimpleCart: builder.query({
      query: () => ({
        url: baseCartEndpoint + "/simple",
        method: "GET",
      }),
      providesTags: ["SIMPLE_CART"],
    }),

    getDetailedCart: builder.query({
      query: () => ({
        url: baseCartEndpoint + "/detail",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["CART"],
    }),

    addToCart: builder.mutation({
      query: ({ productId, itemId, quantity }) => ({
        url: baseCartEndpoint + "/item",
        method: "POST",
        data: { productId, itemId, quantity },
      }),
    }),

    removeCartItem: builder.mutation({
      query: ({ productId, itemId }) => ({
        url: baseCartEndpoint + "/item",
        method: "DELETE",
        data: { productId, itemId },
      }),
    }),

    updateCartItemQuantity: builder.mutation({
      query: ({ productId, itemId, quantity }) => ({
        url: baseCartEndpoint + "/item-quantity",
        method: "PUT",
        data: { productId, itemId, quantity },
      }),
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: baseCartEndpoint + "/all-items",
        method: "DELETE",
      }),
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
