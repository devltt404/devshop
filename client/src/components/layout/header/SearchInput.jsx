import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function SearchInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOverlayVisible(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 150); // wait 150ms for the exit animation to finish
  };
  return (
    <form
      className={`transition-outline relative flex w-[35rem] items-stretch overflow-hidden rounded-md border focus-within:border-none focus-within:ring-2 focus-within:ring-primary`}
    >
      {/* Overlay */}
      {isOverlayVisible && (
        <div
          className={`fixed inset-0 z-50 bg-black/50 ${
            !isFocused
              ? "animate-out fade-out-0 fill-mode-forwards"
              : "animate-in fade-in-0"
          }`}
        ></div>
      )}

      <input
        type="text"
        placeholder="Search for products..."
        className="z-50 flex-1 bg-muted py-2 pl-4 pr-12 focus:outline-none"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button className="z-50 bg-primary px-4 text-primary-foreground">
        <SearchIcon className="h-5 w-5 stroke-2" />
      </button>
    </form>
  );
}
