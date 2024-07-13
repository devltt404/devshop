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
import { useParams } from "react-router-dom";
import LoadingArea from "../../components/loading/LoadingArea.jsx";
import { LazyNotFound } from "../index.js";

const ProductPage = () => {
  const { slug } = useParams();

  const { data, isLoading } = useGetProductDetailQuery({
    id: slug.slice(slug.lastIndexOf("-") + 1),
  });

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

  if (isLoading || (product && !selectedItem)) {
    return <LoadingArea />;
  }

  if (!product) {
    return <LazyNotFound />;
  }

  return (
    <div className="container-area">
      <div>
        <ProductBreadcrumb categories={product.categoryId} />
        <div className="mt-4 flex gap-12">
          {/* LEFT */}
          <div className="w-[32rem]">
            <ImageCarousel data={data} images={product.images} />
          </div>

          {/* MID */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{product.name}</h1>

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
              <p className="mb-1 text-3xl font-bold">
                ${displayPrice(selectedItem?.price?.toFixed(2))}
              </p>
              {selectedItem?.originalPrice && (
                <p>
                  <span className="text-gray-400 line-through">
                    ${displayPrice(selectedItem?.originalPrice)}
                  </span>{" "}
                  <span className="font-semibold text-green-600">
                    Save $
                    {displayPrice(
                      selectedItem?.originalPrice - selectedItem?.price,
                    )}
                  </span>
                </p>
              )}
            </div>

            {/* VARIATION */}
            {product.type === "configurable" && (
              <div>
                {product.variationGroupId?.variations?.map((variation, i) => (
                  <div className="mb-4" key={i}>
                    <h3 className="mb-1 font-semibold">{variation.label}</h3>
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
            <ProductDetails details={product.details} />
          </div>

          {/* RIGHT */}
          <div className="h-fit w-72 rounded-lg border px-6 py-4">
            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold">Quantity</h3>
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
              <h3 className="mb-1 text-lg font-bold">Total</h3>
              <p className="text-2xl font-semibold">
                ${displayPrice(selectedItem?.price * (quantity || 1))}
              </p>
            </div>
            <AddToCartBtn
              quantity={quantity}
              productId={product._id}
              itemId={selectedItem?._id}
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
