import AuthWrapper from "@/components/wrappers/AuthWrapper.jsx";
import GuestWrapper from "@/components/wrappers/GuestWrapper.jsx";
import ShopWrapper from "@/components/wrappers/ShopWrapper.jsx";
import {
  LazyCart,
  LazyCheckout,
  LazyIndex,
  LazyLogin,
  LazyNotFound,
  LazyOrder,
  LazyOrders,
  LazyProduct,
  LazyProfile,
  LazyRegister,
} from "@/pages/index.js";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingScreen from "./loading/LoadingScreen.jsx";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<ShopWrapper />}>
          {/* PUBLIC */}
          <Route path="*" element={<LazyNotFound />} />
          <Route path="/" element={<LazyIndex />} />
          <Route path="/cart" element={<LazyCart />} />
          <Route path="/checkout" element={<LazyCheckout />} />
          <Route path="/product/:slug" element={<LazyProduct />} />
          <Route path="/order/:id" element={<LazyOrder />} />

          {/* GUEST ONLY */}
          <Route element={<GuestWrapper />}>
            <Route path="/register" element={<LazyRegister />} />
            <Route path="/login" element={<LazyLogin />} />
          </Route>

          {/* AUTH ONLY */}
          <Route element={<AuthWrapper />}>
            <Route path="/orders" element={<LazyOrders />} />
            <Route path="/profile" element={<LazyProfile />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
