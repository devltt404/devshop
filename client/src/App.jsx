import { Route, Routes } from "react-router-dom";
import ShopContainer from "./components/containers/ShopContainer.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import NotFoundPage from "./pages/error/NotFoundPage.jsx";
import IndexPage from "./pages/main/IndexPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<ShopContainer />}>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<IndexPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
