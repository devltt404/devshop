import { Outlet } from "react-router-dom";
import Footer from "../layout/Footer.jsx";
import Header from "../layout/Header.jsx";

export default function ShopContainer() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
