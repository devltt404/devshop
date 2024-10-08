import AuthWrapper from "@/components/wrappers/AuthWrapper.jsx";
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
  LazyProductsList,
  LazyProfile,
  LazyRegister,
} from "@/pages/index.js";
import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AuthFormWrapper from "./wrappers/AuthFormWrapper.jsx";

const AppRoutes = () => {
  const location = useLocation(); // Get the current location

  return (
      <Routes location={location} key={location.pathname}>
        <Route>
          {/* GUEST ONLY */}
          <Route element={<AuthFormWrapper />}>
            <Route path="/register" element={<LazyRegister />} />
            <Route path="/login" element={<LazyLogin />} />
          </Route>

          <Route element={<ShopWrapper />}>
            {/* PUBLIC */}
            <Route path="*" element={<LazyNotFound />} />
            <Route path="/" element={<LazyIndex />} />
            <Route path="/cart" element={<LazyCart />} />
            <Route path="/checkout" element={<LazyCheckout />} />
            <Route path="/product/:productSlug" element={<LazyProduct />} />
            <Route path="/search" element={<LazyProductsList />} />
            <Route
              path="/category/:categorySlug"
              element={<LazyProductsList />}
            />
            <Route path="/order/:id" element={<LazyOrder />} />

            {/* AUTH ONLY */}
            <Route element={<AuthWrapper />}>
              <Route path="/orders" element={<LazyOrders />} />
              <Route path="/profile" element={<LazyProfile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
  );
};

export default AppRoutes;
