import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { toast } from "@/components/ui/use-toast.js";
import useAuth from "@/hooks/useAuth.jsx";
import { useLogoutMutation } from "@/redux/api/auth.api.js";
import { clearUser } from "@/redux/slices/auth.slice.js";
import { ReceiptText, User2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button.jsx";

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
    <div className="hover flex flex-col items-start text-secondary group-hover:text-primary">
      <span className="text-xs">{sub}</span>
      <span className="-mt-1 text-sm font-bold">{main}</span>
    </div>
  );
};

const UserMenu = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [logoutUser] = useLogoutMutation();

  function handleLogout() {
    logoutUser()
      .unwrap()
      .then(() => {
        dispatch(clearUser(null));
        toast({
          title: "Logout successfully",
          description: "You can still enjoy shopping with us!",
        });
      });
  }

  return !user ? (
    <Link
      to="/login"
      className="group flex items-center rounded-md px-4 py-3 transition hover:bg-muted"
    >
      <User2 className="mr-2 stroke-[1.5px] text-secondary transition group-hover:text-primary" />
      <TextGroup sub="Login" main="Account" />
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center rounded-md px-4 py-3 transition hover:bg-muted">
        <User2 className="mr-2 stroke-[1.5px] text-secondary transition group-hover:text-primary" />
        <TextGroup sub={`Hello, ${user.name.split(" ")[0]}`} main="Account" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel className="px-4 py-3 text-base">
          {user.name}
          <p className="truncate text-sm font-normal">{user.email}</p>
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
