import { Outlet } from "react-router-dom";
import Footer from "../layout/Footer.jsx";
import Header from "../layout/header/Header.jsx";

export default function ShopWrapper() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
