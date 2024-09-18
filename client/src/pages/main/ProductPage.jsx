import LoadingArea from "@/components/loading/LoadingArea.jsx";
import AddToCartBtn from "@/components/product/AddToCartBtn.jsx";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb.jsx";
import ProductDetails from "@/components/product/ProductDetails.jsx";
import ProductQuantity from "@/components/product/ProductQuantity.jsx";
import RatingRow from "@/components/product/RatingRow.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ImageCarousel } from "@/components/ui/image-carousel.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { cn } from "@/lib/utils.js";
import { useGetProductDetailQuery } from "@/redux/api/product.api.js";
import { displayPrice } from "@/utils/helper.util.js";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { LazyNotFound } from "../index.js";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const { productSlug } = useParams();

  const { data, isLoading } = useGetProductDetailQuery({
    id: productSlug.slice(productSlug.lastIndexOf("-") + 1),
  });

  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState([]);

  const product = useMemo(() => {
    return data?.metadata?.product;
  }, [data]);

  useEffect(() => {
    if (product) {
      if (product.variations.length === 0) {
        setSelectedSku(product.skus[0]);
        return;
      }

      const skuId = searchParams.get("skuId");
      if (skuId) {
        const newSku = product.skus.find((sku) => sku._id === skuId);
        if (!newSku) {
          window.history.replaceState(null, "", window.location.pathname);
          setSelectedSku(undefined);
        } else {
          setSelectedSku(newSku);
          setSelectedVariationIndex(newSku.variationIndex);
        }
      } else {
        setSelectedSku(undefined);
      }
    }
  }, [product, searchParams]);

  // Loading
  if (isLoading || selectedSku === null) {
    return <LoadingArea />;
  }

  if (!product) {
    return <LazyNotFound />;
  }

  const handleSelectSku = (changeIndex, changeValue) => {
    const newVariationIndex = [...selectedVariationIndex];
    if (newVariationIndex[changeIndex] === changeValue) {
      newVariationIndex[changeIndex] = undefined;
    } else {
      newVariationIndex[changeIndex] = changeValue;
    }

    for (let i = 0; i < product.variations.length; i++) {
      if (newVariationIndex[i] === undefined) {
        setSelectedSku(undefined);
        setSelectedVariationIndex(newVariationIndex);
        return;
      }
    }
    const newSku = product.skus.find((sku) => {
      return _.isEqual(sku.variationIndex, newVariationIndex);
    });

    if (!newSku) return;
    setSelectedSku(newSku);

    // Update URL
    window.history.replaceState(
      null,
      "",
      window.location.pathname + "?skuId=" + newSku._id,
    );

    setSelectedVariationIndex(newVariationIndex);
  };

  const isOptionAvailable = (currentIndex, optionIndex) => {
    const testVariationIndex = [...selectedVariationIndex];
    testVariationIndex[currentIndex] = optionIndex;

    return product.skus.some((sku) =>
      sku.variationIndex.every(
        (value, i) =>
          // If a variation is not selected, skip it (treat it as a wildcard)
          testVariationIndex[i] === undefined ||
          testVariationIndex[i] === value,
      ),
    );
  };

  return (
    <div className="container-area">
      <div>
        <ProductBreadcrumb categories={product.category} />

        <div className="mt-6 flex items-start gap-14 bg-white px-6 pb-12 pt-8">
          {/* LEFT */}
          <div className="w-[25rem]">
            <ImageCarousel
              data={data}
              images={[
                ...(selectedSku ? selectedSku.images : product.skus[0].images),
                ...product.images,
              ]}
            />
          </div>

          {/* MID */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="my-2 text-sm text-muted-foreground">
              {selectedSku
                ? "SKU: " + selectedSku._id
                : "Please select a variant to see the SKU"}
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <p className="mr-2 pt-1 text-yellow-500">
                {product.avgRating.toFixed(1)}
              </p>
              <RatingRow rating={product.avgRating} />

              <Separator className="mx-2 h-4 w-[1px]" />
              <span>
                {product.numReviews}{" "}
                {product.numReviews === 1 ? "review" : "reviews"}
              </span>

              <Separator className="mx-2 h-4 w-[1px]" />
              <span>{product.numSold} sold</span>
            </div>

            <Separator className="my-6" />

            {/* PRICE */}
            <div className="mb-4">
              <p className="mb-1 text-3xl font-bold">
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
                      {displayPrice(
                        selectedSku.originalPrice - selectedSku.price,
                      )}
                    </span>
                  </p>
                )
              ) : (
                <p className="text-gray-400">
                  {`Select a variant to see the exact price`}
                </p>
              )}
            </div>

            {/* VARIATION */}
            {
              <ul className="space-y-4">
                {product.variations.map((variation, i) => (
                  <li key={i}>
                    <h3
                      className={cn(
                        "mb-2 font-normal",
                        selectedVariationIndex[i] ??
                          "font-semibold text-destructive",
                      )}
                    >
                      {variation.name}:{" "}
                      <span className="font-semibold">
                        {
                          variation.options.find((opt, index) => {
                            return index === selectedVariationIndex[i];
                          })?.value
                        }
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {variation.options.map((option, i2) => {
                        return (
                          <button
                            key={i2}
                            disabled={!isOptionAvailable(i, i2)}
                            className={cn(
                              "rounded-md border px-6 py-3 text-sm disabled:border-gray-300 disabled:bg-muted disabled:text-gray-400 disabled:shadow-none",
                              selectedVariationIndex[i] === i2
                                ? "border-black shadow-outer"
                                : "hover:border-black hover:shadow-outer",
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
                                  className="h-10 w-10 object-contain"
                                />
                              ) : (
                                <p> {option.value}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            }

            <Separator className="my-6" />
            <ProductDetails details={product.details} />
          </div>

          {/* RIGHT */}
          <div className="h-fit w-72 rounded-lg border px-6 py-4">
            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold">Quantity</h3>
              <p className="mb-2 text-sm text-gray-400">
                {!selectedSku
                  ? "Please choose a valid variant"
                  : `There are ${selectedSku?.stock} items left.`}
              </p>

              <ProductQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                stock={selectedSku?.stock}
              />
            </div>

            {/* Total */}
            <div className="mt-4">
              <h3 className="mb-1 text-lg font-bold">Total</h3>
              <p className="text-2xl font-semibold">
                {`$${displayPrice(selectedSku ? selectedSku.price * (quantity || 1) : 0)}`}
              </p>
            </div>
            <AddToCartBtn
              quantity={quantity}
              productId={product._id}
              skuId={selectedSku?._id}
            />

            <br />

            <Button variant="secondary" className="mt-3 w-full py-6">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
