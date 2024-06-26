import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numCartItems: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setNumCartItems(state, action) {
      state.numCartItems = action.payload;
    },
    decrementNumCartItems(state) {
      state.numCartItems -= 1;
    },
    resetCart(state) {
      state.numCartItems = null;
    },
  },
});

export const cartSelector = (state) => state.cart;
export const { setNumCartItems, resetCart, decrementNumCartItems } = cartSlice.actions;
export default cartSlice.reducer;
