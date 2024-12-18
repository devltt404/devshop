import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchInput() {
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [key, setKey] = useState("");

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
      className={`transition-outline relative flex max-w-[35rem] flex-1 items-stretch overflow-hidden rounded-md border focus-within:border-none focus-within:ring-2 focus-within:ring-primary`}
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search?key=${key}`);
        inputRef.current?.blur();
      }}
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
        ref={inputRef}
        type="text"
        placeholder="Search for products..."
        className="z-50 min-w-0 flex-1 bg-muted py-2 pl-4 pr-6 focus:outline-none"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button
        type="submit"
        disabled={!key}
        className="z-50 shrink-0 bg-primary px-4 text-primary-foreground"
      >
        <SearchIcon className="h-5 w-5 stroke-2" />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
