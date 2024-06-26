import { lazy } from "react";

// auth
export const LazyLogin = lazy(() => import("../pages/auth/LoginPage.jsx"));
export const LazyRegister = lazy(() => import("../pages/auth/RegisterPage.jsx"));

// error
export const LazyNotFound = lazy(() => import("../pages/error/NotFoundPage.jsx"));

// main
export const LazyIndex = lazy(() => import("../pages/main/IndexPage.jsx"));
export const LazyProduct = lazy(() => import("../pages/main/ProductPage.jsx"));
export const LazyCart = lazy(() => import("../pages/main/CartPage.jsx"));
