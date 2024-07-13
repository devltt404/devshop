import Logo from "../../Logo.jsx";
import CartButton from "./CartButton.jsx";
import Headline from "./Headline.jsx";
import SearchInput from "./SearchInput.jsx";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  return (
    <header className="border-b">
      {/* Headline */}
      <Headline />

      <div className="shadow-md">
        <div className="container flex items-center justify-between py-4">
          <Logo />
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
