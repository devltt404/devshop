import ProductsCarousel from "@/components/product/ProductsCarousel.jsx";
import useGetProducts from "@/hooks/useGetProducts.jsx";
import { Flame } from "lucide-react";

const BestSellingSection = () => {
  const { products, isLoading } = useGetProducts({
    sortBy: "sold",
    order: "desc",
    limit: 10,
  });

  return (
    <section>
      <div className="bg-primary py-6">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <Flame className="h-12 w-12 stroke-[0.8px] text-white" />
          <h2 className="text-stroke text-center text-5xl font-extrabold text-primary-foreground">
            Best Selling
          </h2>
          <Flame className="h-12 w-12 stroke-[0.8px] text-white" />
        </div>
      </div>

      <div className="border-b bg-white py-12">
        <div className="container">
          <ProductsCarousel products={products} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default BestSellingSection;
