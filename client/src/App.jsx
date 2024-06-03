import Cookies from "js-cookie";
import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import AuthContainer from "./components/containers/AuthContainer.jsx";
import GuestContainer from "./components/containers/GuestContainer.jsx";
import ShopContainer from "./components/containers/ShopContainer.jsx";
import LoadingScreen from "./components/loading/LoadingScreen.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import NotFoundPage from "./pages/error/NotFoundPage.jsx";
import IndexPage from "./pages/main/IndexPage.jsx";
import { useAuthUserQuery } from "./services/auth.service.js";

export default function App() {
  const { isLoading } = useAuthUserQuery(null, {
    skip: !Cookies.get("session"),
  });

  return (
    <Fragment>
      {!isLoading ? (
        <Routes>
          <Route element={<ShopContainer />}>
            {/* PUBLIC */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<IndexPage />} />

            {/* GUEST ONLY */}
            <Route element={<GuestContainer />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* AUTH ONLY */}
            <Route element={<AuthContainer />}></Route>
          </Route>
        </Routes>
      ) : (
        <LoadingScreen />
      )}
    </Fragment>
  );
}
