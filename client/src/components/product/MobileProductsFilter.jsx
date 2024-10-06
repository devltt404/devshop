import { cn } from "@/lib/utils.js";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button.jsx";
import ProductsFilterMenu from "./ProductsFilterMenu.jsx";

const FilterModal = ({ query, onQueryChange, onClearQuery, setShowFilter }) => {
  const menuRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    };

    window.addEventListener("click", closeOnOutsideClick);

    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [setIsVisible]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80",
          isVisible ? "animate-in fade-in" : "opacity-0",
        )}
      ></div>
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-full max-w-[18rem] bg-white p-6 duration-300 ease-in-out slide-in-from-left-1/2 slide-out-to-left-1/2",
          isVisible
            ? "animate-in slide-in-from-left-full"
            : "animation-fill-forwards animate-out slide-out-to-left-full",
        )}
        onAnimationEnd={() => {
          if (!isVisible) {
            setShowFilter(false);
          }
        }}
        ref={menuRef}
      >
        <ProductsFilterMenu
          query={query}
          onQueryChange={onQueryChange}
          onClearQuery={onClearQuery}
        />
      </div>
    </>
  );
};

const MobileProductsFilter = ({ query, onQueryChange, onClearQuery }) => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="text-base font-medium"
        onClick={(e) => {
          setShowFilter(true);
          e.stopPropagation();
        }}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>

      {showFilter && (
        <FilterModal
          query={query}
          onQueryChange={onQueryChange}
          onClearQuery={onClearQuery}
          setShowFilter={setShowFilter}
        />
      )}
    </>
  );
};

export default MobileProductsFilter;
