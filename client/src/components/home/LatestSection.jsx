import { useGetProductsQuery } from "@/redux/api/product.api.js";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard.jsx";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton.jsx";
import { Button } from "../ui/button.jsx";

const LatestSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { data } = useGetProductsQuery({
    page: currentPage,
    limit: 10,
    sortBy: "ctimeDesc",
  });

  useEffect(() => {
    if (data?.metadata?.products) {
      setProducts([...products, ...data.metadata.products]);
      setShowSkeleton(false);
    }
  }, [data]);

  return (
    <section>
      <h2 className="mb-6 text-3xl font-semibold">Latest Products</h2>
      <div className="grid grid-cols-5 gap-x-4 gap-y-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}

        {showSkeleton &&
          Array.from({ length: 10 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
      </div>

      {currentPage < data?.metadata?.pagination.totalPages && (
        <div className="mt-8 text-center">
          <Button
            variant="secondary"
            className="px-16"
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setShowSkeleton(true);
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default LatestSection;
