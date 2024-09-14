import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalQuantity: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setNumCartItems(state, action) {
      state.totalQuantity = action.payload;
    },
    decrementNumCartItems(state) {
      state.totalQuantity -= 1;
    },
    resetCart(state) {
      state.totalQuantity = null;
    },
  },
});

export const cartSelector = (state) => state.cart;
export const { setNumCartItems, resetCart, decrementNumCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;
