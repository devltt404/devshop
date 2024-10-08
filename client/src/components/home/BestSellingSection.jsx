import ProductsCarousel from "@/components/product/ProductsCarousel.jsx";
import { useGetProductsQuery } from "@/redux/api/product.api.js";
import { Flame } from "lucide-react";

const BestSellingSection = () => {
  const { data, isLoading } = useGetProductsQuery({
    limit: 10,
    sortBy: "soldDesc",
  });

  return (
    <section>
      <div className="bg-primary py-6">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <Flame className="h-12 w-12 stroke-[0.8px] text-white" />
          <h2 className="text-center text-stroke text-5xl font-extrabold text-primary-foreground">
            Best Selling
          </h2>
          <Flame className="h-12 w-12 stroke-[0.8px] text-white" />
        </div>
      </div>

      <div className="border-b bg-white py-12">
        <div className="container">
          <ProductsCarousel
            products={data?.metadata?.products}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default BestSellingSection;
