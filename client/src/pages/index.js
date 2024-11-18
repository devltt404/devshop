import { lazy } from "react";

// auth
export const LazyLogin = lazy(() => import("../pages/auth/LoginPage.jsx"));
export const LazyRegister = lazy(
  () => import("../pages/auth/RegisterPage.jsx"),
);

// error
export const LazyNotFound = lazy(
  () => import("../pages/error/NotFoundPage.jsx"),
);

// main
export const LazyCart = lazy(() => import("../pages/main/CartPage.jsx"));
export const LazyCheckout = lazy(
  () => import("../pages/main/CheckoutPage.jsx"),
);
export const LazyOrder = lazy(() => import("../pages/main/OrderPage.jsx"));
export const LazyOrders = lazy(() => import("../pages/main/OrdersPage.jsx"));
export const LazyProfile = lazy(() => import("../pages/main/ProfilePage.jsx"));
export const LazyProductsList = lazy(
  () => import("../pages/main/ProductsListPage.jsx"),
);
