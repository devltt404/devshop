import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.isAuthLoading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const authSelector = (state) => state.auth;
export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
