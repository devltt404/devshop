import ProductBreadcrumb from "@/components/product/ProductBreadcrumb.jsx";
import ProductQuantity from "@/components/product/ProductQuantity.jsx";
import RatingRow from "@/components/product/RatingRow.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ImageCarousel } from "@/components/ui/image-carousel.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { cn } from "@/lib/utils.js";
import { useGetProductDetailQuery } from "@/redux/api/product.api.js";
import _ from "lodash";
import { ShoppingCart } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingArea from "../../components/loading/LoadingArea.jsx";
import { LazyNotFound } from "../index.js";

const ProductPage = () => {
  const { pathname } = useLocation();
  const { data, isLoading } = useGetProductDetailQuery({
    id: pathname.split("/").pop().split("-").pop(),
  });

  const [showFullDetails, setShowFullDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return data?.metadata?.product;
  }, [data]);

  useEffect(() => {
    if (product) {
      if (product.type === "configurable") {
        setSelectedItem(
          product.items.find((item) => item._id === product.defaultItemId),
        );
      } else {
        setSelectedItem({
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
        });
      }
    }
  }, [product]);

  if (isLoading) {
    return <LoadingArea />;
  }

  if (!product) {
    return <LazyNotFound />;
  }
  return (
    <div className="py-container container">
      <div>
        <ProductBreadcrumb categories={product.categoryId} />
        <div className="mt-4 flex gap-12">
          {/* LEFT */}
          <div className="w-[32rem]">
            <ImageCarousel data={data} images={product.images} />
          </div>

          {/* MID */}
          <div className="flex-1">
            <h1 className="text-3xl font-medium">{product.name}</h1>

            <div className="mt-2 flex items-center text-sm text-gray-400">
              <span className="mr-2 text-yellow-500">
                {product.avgRating.toFixed(1)}
              </span>
              <RatingRow rating={product.avgRating} />

              <Separator className="mx-2 h-4 w-[1px]" />
              <span>
                {product.numReviews}{" "}
                {product.numReviews === 1 ? "review" : "reviews"}
              </span>

              <Separator className="mx-2 h-4 w-[1px]" />
              <span>{product.numSold} sold</span>
            </div>

            <Separator className="my-4" />

            {/* PRICE */}
            <div className="mb-4">
              <p className="mb-1 text-3xl font-semibold">
                ${selectedItem?.price?.toFixed(2)}
              </p>
              {selectedItem?.originalPrice && (
                <p>
                  <span className="text-gray-400 line-through">
                    ${selectedItem?.originalPrice.toFixed(2)}
                  </span>{" "}
                  <span className="font-medium text-green-600">
                    Save $
                    {(
                      selectedItem?.originalPrice - selectedItem?.price
                    ).toFixed(2)}
                  </span>
                </p>
              )}
            </div>

            {/* VARIATION */}
            {product.type === "configurable" && (
              <div>
                {product.variationGroupId?.variations?.map((variation, i) => (
                  <div className="mb-4" key={i}>
                    <h3 className="mb-1 font-medium">{variation.label}</h3>
                    <div className="flex flex-wrap gap-4">
                      {variation.options.map((option, i2) => {
                        return (
                          <button
                            key={i2}
                            className={cn(
                              "rounded-md border px-6 py-2 text-sm shadow-black transition",
                              selectedItem?.variationSelection?.[
                                variation.code
                              ] !== option.value
                                ? "hover:border-black hover:shadow-outer"
                                : "border-black shadow-outer",
                            )}
                            onClick={() => {
                              setSelectedItem(
                                product.items.find((item) => {
                                  const newItemVariationSelection = {
                                    ...selectedItem.variationSelection,
                                    [variation.code]: option.value,
                                  };

                                  return _.isEqual(
                                    newItemVariationSelection,
                                    item.variationSelection,
                                  );
                                }),
                              );
                              setQuantity(1);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt={option.value}
                                  className="h-8 w-8 object-cover"
                                />
                              )}
                              {option.value}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            <div>
              <h2 className="mb-2 text-lg font-semibold">Details</h2>
              <div className="relative">
                <div
                  className={cn(
                    "grid grid-cols-[200px_1fr] gap-x-2 gap-y-2 overflow-y-hidden",
                    showFullDetails ? "h-auto" : "h-36",
                  )}
                >
                  {Object.keys(product.details).map((key, i) => (
                    <Fragment key={i}>
                      <span className="font-medium">{key}</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: product.details[key],
                        }}
                      />
                    </Fragment>
                  ))}
                </div>

                {!showFullDetails && (
                  <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>

              {showFullDetails ? (
                <button
                  className="mt-1 text-blue-500"
                  onClick={() => setShowFullDetails(false)}
                >
                  Show less
                </button>
              ) : (
                <button
                  className="mt-1 text-blue-500"
                  onClick={() => setShowFullDetails(true)}
                >
                  Show more
                </button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="h-fit w-72 rounded-lg border px-6 py-4">
            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold">Quantity</h3>
              <p className="mb-2 text-sm text-gray-400">
                There are {selectedItem?.stock} items left.
              </p>

              <ProductQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                stock={selectedItem?.stock}
              />
            </div>

            {/* Total */}
            <div className="mt-4">
              <h3 className="mb-1 text-lg font-semibold">Total</h3>
              <p className="text-2xl font-medium">
                ${(selectedItem?.price * quantity).toFixed(2)}
              </p>
            </div>
            <Button className="mt-4 w-full py-6">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
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
