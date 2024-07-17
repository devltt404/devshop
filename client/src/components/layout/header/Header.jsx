import LogoIcon from "@/components/icons/LogoIcon.jsx";
import { Link } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import Headline from "./Headline.jsx";
import SearchInput from "./SearchInput.jsx";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  return (
    <header>
      {/* Headline */}
      <Headline />

      <div className="border-b shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <Link to="/">
            <LogoIcon className="w-52" />
          </Link>

          <SearchInput />

          <div className="flex gap-2">
            <UserMenu />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
