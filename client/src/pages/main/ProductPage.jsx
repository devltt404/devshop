import LoadingArea from "@/components/loading/LoadingArea.jsx";
import AddToCartBtn from "@/components/product/AddToCartBtn.jsx";
import ImagesPreview from "@/components/product/ImagesPreview.jsx";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb.jsx";
import ProductDescription from "@/components/product/ProductDescription.jsx";
import ProductFeatures from "@/components/product/ProductFeatures.jsx";
import ProductInfo from "@/components/product/ProductInfo.jsx";
import ProductQuantity from "@/components/product/ProductQuantity.jsx";
import ProductVariations from "@/components/product/ProductVariations.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import shopConfig from "@/configs/shop.config.js";
import { useGetProductDetailQuery } from "@/redux/api/product.api.js";
import { displayPrice } from "@/utils/helper.util.js";
import _ from "lodash";
import { TruckIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  }, [data?.metadata?.product]);

  const handleSelectSku = useCallback(
    (changeIndex, changeValue) => {
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
          window.history.replaceState(null, "", window.location.pathname);
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
    },
    [product, selectedVariationIndex],
  );

  const isOptionAvailable = useCallback(
    (currentIndex, optionIndex) => {
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
    },
    [product, selectedVariationIndex],
  );

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

  if (isLoading || selectedSku === null) {
    return <LoadingArea />;
  }

  if (!product) {
    return <LazyNotFound />;
  }

  return (
    <div className="page-spacer">
      <div className="container mb-4">
        <ProductBreadcrumb categories={product.category} />
      </div>

      <div className="md:container">
        <div className="shadow-block grid grid-cols-1 items-start gap-x-14 gap-y-8 rounded-xl bg-white px-6 pb-12 pt-8 md:px-10 lg:grid-cols-[40%_1fr]">
          <ImagesPreview
            images={[
              ...(selectedSku ? selectedSku.images : product.skus[0].images),
              ...product.images,
            ]}
          />

          <div className="flex-1">
            <ProductInfo product={product} selectedSku={selectedSku} />

            <ProductVariations
              productVariations={product.variations}
              selectedVariationIndex={selectedVariationIndex}
              handleSelectSku={handleSelectSku}
              isOptionAvailable={isOptionAvailable}
              skus={product.skus}
            />

            <Separator className="my-6" />

            <div>
              <h3 className="mb-2 text-lg font-bold">Quantity</h3>
              <div className="mb-5 flex items-center gap-4">
                <ProductQuantity
                  quantity={quantity}
                  setQuantity={setQuantity}
                  stock={selectedSku?.stock}
                />

                <AddToCartBtn
                  quantity={quantity}
                  productId={product._id}
                  skuId={selectedSku?._id}
                />
              </div>

              <p className="mt-2 flex items-center">
                <TruckIcon className="mr-2 inline-block h-5 w-5" />
                <span className="font-semibold">
                  Free delivery for orders over $
                  {displayPrice(shopConfig.freeShipThreshold)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <ProductDescription product={product} />

        <ProductFeatures features={product.features} />
      </div>
    </div>
  );
};

export default ProductPage;
