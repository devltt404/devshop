import { Outlet } from "react-router-dom";
import Footer from "../layout/Footer.jsx";
import Header from "../layout/header/Header.jsx";
import Headline from "../layout/header/Headline.jsx";

export default function ShopWrapper() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Headline />
        <Header />
        <main className="flex-1 bg-muted">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
