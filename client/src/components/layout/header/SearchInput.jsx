import { SearchIcon } from "lucide-react";
import { Input } from "../../ui/input.jsx";

export default function SearchInput() {
  return (
    <div className="relative w-[35rem]">
      <Input
        type="text"
        placeholder="Search for products..."
        className="peer pl-4 pr-12"
      />
      <SearchIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 stroke-[1.5px] text-muted-foreground transition peer-focus:stroke-2 peer-focus:text-black" />
    </div>
  );
}
