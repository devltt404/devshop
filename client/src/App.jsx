import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShopContainer from "./components/containers/ShopContainer.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopContainer />}>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
