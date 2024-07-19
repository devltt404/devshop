import ProductsCarousel from "@/components/product/ProductsCarousel.jsx";
import { useGetProductsQuery } from "@/redux/api/product.api.js";
import { Flame } from "lucide-react";

const BestSellingSection = () => {
  const { data, isLoading } = useGetProductsQuery({
    limit: 10,
    sortBy: "soldDesc",
  });

  return (
    <section className="container">
      <div className="rounded-lg bg-[url(/best-selling-bg.png)] px-14 py-20">
        <div className="mb-8 flex items-center gap-2 text-white">
          <Flame className="h-7 w-7" />
          <h2 className="text-3xl font-bold">Best Selling!</h2>
        </div>

        <ProductsCarousel
          products={data?.metadata?.products}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default BestSellingSection;
