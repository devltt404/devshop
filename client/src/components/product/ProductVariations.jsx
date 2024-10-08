import { cn } from "@/lib/utils.js";
import React from "react";

const ProductVariations = React.memo(
  ({
    productVariations,
    selectedVariationIndex,
    handleSelectSku,
    setQuantity,
    isOptionAvailable,
  }) => {
    return (
      <ul className="space-y-4">
        {productVariations.map((variation, i) => (
          <li key={i}>
            <h3
              className={cn(
                "mb-2 font-normal",
                selectedVariationIndex[i] ?? "font-semibold text-destructive",
              )}
            >
              {variation.name}:{" "}
              <span className="font-bold text-tertiary">
                {variation.options[selectedVariationIndex[i]]?.value ||
                  "Select an option"}
              </span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {variation.options.map((option, i2) => (
                <button
                  key={i2}
                  disabled={!isOptionAvailable(i, i2)}
                  className={cn(
                    "rounded-md border-2 px-4 py-2.5 disabled:border-gray-300 disabled:bg-muted disabled:text-gray-400 disabled:shadow-none",
                    selectedVariationIndex[i] === i2
                      ? "border-primary"
                      : "hover:border-tertext-tertiary",
                  )}
                  onClick={() => {
                    handleSelectSku(i, i2);
                    setQuantity(1);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.value}
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <p className="text-sm">{option.value}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  },
);

export default ProductVariations;
