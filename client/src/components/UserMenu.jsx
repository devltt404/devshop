import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserInfo, userSelector } from "@/redux/slices/user.slice.js";
import { useLogoutMutation } from "@/services/auth.service.js";
import { ReceiptText, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "./ui/button.jsx";

const dropdownItems = [
  {
    label: "Profile",
    icon: User2,
    to: "/profile",
  },
  {
    label: "Orders",
    icon: ReceiptText,
    to: "/orders",
  },
];

const TextGroup = ({ sub, main }) => {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs text-muted-foreground">{sub}</span>
      <span className="-mt-1 text-sm font-semibold">{main}</span>
    </div>
  );
};

const UserMenu = () => {
  const dispatch = useDispatch();
  const { info } = useSelector(userSelector);

  const [logoutUser] = useLogoutMutation();

  function handleLogout() {
    logoutUser()
      .unwrap()
      .then(({ message }) => {
        dispatch(setUserInfo(null));
      });
  }

  return !info ? (
    <Link
      to="/login"
      className="flex items-center rounded-md px-4 py-3 transition hover:bg-muted"
    >
      <User2 className="mr-2 stroke-[1.5px]" />
      <TextGroup sub="Login" main="Account" />
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-md px-4 py-3 transition hover:bg-muted">
        <User2 className="mr-2 stroke-[1.5px]" />
        <TextGroup sub={`Hello, ${info.name.split(" ")[0]}`} main="Account" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel className="px-4 py-3 text-base">
          {info.name}
          <p className="truncate text-sm font-normal">{info.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        {dropdownItems.map(({ label, icon: Icon, to }) => (
          <DropdownMenuItem
            asChild
            key={label}
            className="cursor-pointer px-4 py-3"
          >
            <Link to={to}>
              <Icon className="mr-3 h-5 w-5 stroke-[1.5px]" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="px-3 py-2">
          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
