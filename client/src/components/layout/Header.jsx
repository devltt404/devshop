import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";
import SearchInput from "../SearchInput.jsx";
import UserMenu from "../UserMenu.jsx";
import Headline from "./Headline.jsx";

export default function Header() {
  return (
    <header className="border-b">
      {/* Headline */}
      <Headline />

      <div className="container flex items-center justify-between py-6">
        <Logo />
        <SearchInput />

        <div className="flex gap-2">
          <UserMenu />

          {/* Cart icon */}
          <Link
            to="/cart"
            className="flex items-center rounded-md px-4 py-3 transition hover:bg-muted"
          >
            <div className="relative mr-2">
              <ShoppingBag className="mr-1 stroke-[1.5px]" />
              <span className="absolute -top-1 right-0 h-4 w-4 scale-90 rounded-full bg-red-600 text-center font-mono text-sm leading-tight text-white">
                5
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="-mt-1 text-sm font-semibold">$0.00</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
