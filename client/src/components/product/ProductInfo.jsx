import { displayPrice } from "@/utils/helper.util.js";
import React from "react";
import { Separator } from "../ui/separator.jsx";
import RatingRow from "./RatingRow.jsx";

const ProductInfo = React.memo(({ product, selectedSku }) => {
  return (
    <>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="my-2 text-sm text-muted-foreground">
        {selectedSku
          ? "SKU: " + selectedSku._id
          : "Please select a variant to see the SKU"}
      </p>
      <div className="flex items-center text-sm text-gray-400">
        <p className="mr-2 pt-1 font-semibold text-[#ffa41c]">
          {product.avgRating.toFixed(1)}
        </p>
        <RatingRow rating={product.avgRating} />

        <Separator className="mx-2 h-4 w-[1px]" />
        <span>
          {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
        </span>

        <Separator className="mx-2 h-4 w-[1px]" />
        <span>{product.numSold} sold</span>
      </div>

      <Separator className="my-6" />

      {/* PRICE */}
      <div className="mb-4">
        <p className="mb-1 text-3xl font-semibold">
          {selectedSku
            ? `$${displayPrice(selectedSku.price)}`
            : `$${displayPrice(product.minPrice)} - $${displayPrice(product.maxPrice)}`}
        </p>
        {selectedSku ? (
          selectedSku.originalPrice > selectedSku.price && (
            <p>
              <span className="text-gray-400 line-through">
                ${displayPrice(selectedSku.originalPrice)}
              </span>{" "}
              <span className="font-semibold text-green-600">
                Save $
                {displayPrice(selectedSku.originalPrice - selectedSku.price)}
              </span>
            </p>
          )
        ) : (
          <p className="text-gray-400">
            {`Select a variant to see the exact price`}
          </p>
        )}
      </div>
    </>
  );
});

export default ProductInfo;
