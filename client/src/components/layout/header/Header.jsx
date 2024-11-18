import LogoIcon from "@/components/icons/LogoIcon.jsx";
import SimpleLogoIcon from "@/components/icons/SimpleLogoIcon.jsx";
import { MEDIA_QUERY } from "@/constants/index.js";
import useMediaQuery from "@/hooks/useMediaQuery.jsx";
import { Link } from "react-router-dom";
import CartButton from "./CartButton.jsx";
import SearchInput from "./SearchInput.jsx";
import UserMenu from "./UserMenu.jsx";

export default function Header() {
  const isMobile = useMediaQuery(MEDIA_QUERY.MOBILE);

  return (
    <header className={"sticky top-0 z-10 bg-white"}>
      <div className="shadow-md">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Link to="/">
            {isMobile ? <SimpleLogoIcon className="w-10" /> : <LogoIcon />}
            <span className="sr-only">Homepage</span>
          </Link>

          <SearchInput />

          <div className="flex gap-1">
            <UserMenu />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
