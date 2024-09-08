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
import LoadingScreen from "../../components/loading/LoadingScreen.jsx";
import { LazyNotFound } from "../index.js";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();

  const { data, isLoading } = useGetProductDetailQuery({
    id: slug.slice(slug.lastIndexOf("-") + 1),
  });

  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return data?.metadata?.product;
  }, [data]);

  useEffect(() => {
    if (!product) return;
    setSelectedSku(
      product.skus.find((sku) => sku._id === searchParams.get("skuId")),
    );
  }, [product]);

  if (isLoading || (product && !selectedSku)) {
    return <LoadingScreen />;
  }

  if (!product || !selectedSku) {
    return <LazyNotFound />;
  }

  const handleSelectSku = (changeIndex, changeValue) => {
    const newVariationIndex = [...selectedSku.variationIndex];
    newVariationIndex[changeIndex] = changeValue;

    const newSku = product.skus.find((sku) => {
      return _.isEqual(sku.variationIndex, newVariationIndex);
    });
    setSelectedSku(newSku);

    // Update URL
    window.history.replaceState(
      null,
      "",
      window.location.pathname + "?skuId=" + newSku._id,
    );
  };

  return (
    <div className="container-area">
      <div>
        <ProductBreadcrumb categories={product.category} />

        <div className="mt-6 flex items-start gap-8">
          {/* LEFT */}
          <div className="w-[28rem] bg-white px-4 py-6">
            <ImageCarousel data={data} images={selectedSku.images} />
          </div>

          {/* MID */}
          <div className="flex-1 bg-white px-8 py-6">
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
                ${displayPrice(selectedSku.price)}
              </p>
              {selectedSku?.originalPrice && (
                <p>
                  <span className="text-gray-400 line-through">
                    ${displayPrice(selectedSku.originalPrice)}
                  </span>{" "}
                  <span className="font-semibold text-green-600">
                    Save $
                    {displayPrice(
                      selectedSku?.originalPrice - selectedSku?.price,
                    )}
                  </span>
                </p>
              )}
            </div>

            {/* VARIATION */}
            {
              <div>
                {product.variations.map((variation, i) => (
                  <div className="mb-4" key={i}>
                    <h3 className="mb-1 font-semibold">{variation.name}</h3>
                    <div className="flex flex-wrap gap-4">
                      {variation.options.map((option, i2) => {
                        return (
                          <button
                            key={i2}
                            className={cn(
                              "rounded-md border px-6 py-2 text-sm",
                              selectedSku.variationIndex[i] === i2
                                ? "border-black shadow-outer"
                                : "hover:border-black hover:shadow-outer",
                            )}
                            onClick={() => {
                              handleSelectSku(i, i2);
                              setQuantity(1);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt={option.value}
                                  className="h-8 w-8 object-contain"
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
            }

            <Separator className="my-4" />
            <ProductDetails details={product.details} />
          </div>

          {/* RIGHT */}
          <div className="h-fit w-72 rounded-lg border bg-white px-6 py-4">
            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold">Quantity</h3>
              <p className="mb-2 text-sm text-gray-400">
                There are {selectedSku.stock} items left.
              </p>

              <ProductQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                stock={selectedSku.stock}
              />
            </div>

            {/* Total */}
            <div className="mt-4">
              <h3 className="mb-1 text-lg font-bold">Total</h3>
              <p className="text-2xl font-semibold">
                ${displayPrice(selectedSku.price * (quantity || 1))}
              </p>
            </div>
            <AddToCartBtn
              quantity={quantity}
              productId={product._id}
              itemId={selectedSku._id}
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
