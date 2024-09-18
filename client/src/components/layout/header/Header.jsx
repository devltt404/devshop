import LogoIcon from "@/components/icons/LogoIcon.jsx";
import CartButton from "./CartButton.jsx";
import SearchInput from "./SearchInput.jsx";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  return (
    <header className={"sticky top-0 z-10 bg-white"}>
      <div className="border-b shadow-md">
        <div className="container flex items-center justify-between py-3">
          <LogoIcon className="w-52" />

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
