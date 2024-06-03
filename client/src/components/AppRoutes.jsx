import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AuthContainer from "./containers/AuthContainer.jsx";
import GuestContainer from "./containers/GuestContainer.jsx";
import ShopContainer from "./containers/ShopContainer.jsx";
import LoadingScreen from "./loading/LoadingScreen.jsx";

// region lazy imports
// auth
const Login = lazy(() => import("../pages/auth/LoginPage.jsx"));
const Register = lazy(() => import("../pages/auth/RegisterPage.jsx"));

// error
const NotFound = lazy(() => import("../pages/error/NotFoundPage.jsx"));

// main
const Index = lazy(() => import("../pages/main/IndexPage.jsx"));
// endregion lazy imports

//---------------------------------------------------------------------------------

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<ShopContainer />}>
          {/* PUBLIC */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Index />} />

          {/* GUEST ONLY */}
          <Route element={<GuestContainer />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* AUTH ONLY */}
          <Route element={<AuthContainer />}></Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
