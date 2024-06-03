import { authApi } from "@/services/auth.service.js";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userSlice from "./slices/user.slice.js";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);
