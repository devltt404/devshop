import LogoIcon from "@/components/icons/LogoIcon.jsx";
import { cn } from "@/lib/utils.js";
import { useEffect, useState } from "react";
import CartButton from "./CartButton.jsx";
import SearchInput from "./SearchInput.jsx";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "bg-white",
        isSticky && "animate-drop-down sticky top-0 z-10",
      )}
    >
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
