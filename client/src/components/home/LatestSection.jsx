import ProductCard from "@/components/product/ProductCard.jsx";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton.jsx";
import { useGetProductsQuery } from "@/redux/api/product.api.js";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button.jsx";

const LatestSection = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { data } = useGetProductsQuery({
    page,
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
    <section className="container">
      <h2 className="mb-8 text-3xl font-bold">Latest Products</h2>
      <div className="grid grid-cols-5 gap-x-6 gap-y-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}

        {showSkeleton &&
          Array.from({ length: 10 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
      </div>

      {page < data?.metadata?.pagination.totalPages && (
        <div className="mt-8 text-center">
          <Button
            size="lg"
            variant="secondary"
            className="px-16"
            onClick={() => {
              setPage(page + 1);
              setShowSkeleton(true);
            }}
          >
            Load More
            <ArrowDown className="ml-2 h-4 w-4 stroke-[3px]" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default LatestSection;
