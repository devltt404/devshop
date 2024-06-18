import { useGetProductsQuery } from "@/redux/api/product.api.js";
import { Flame } from "lucide-react";
import ProductsCarousel from "@/components/product/ProductsCarousel.jsx";

const BestSellingSection = () => {
  const { data, isLoading } = useGetProductsQuery({
    limit: 10,
    sortBy: "soldDesc",
  });

  return (
    <section className="rounded-lg bg-muted px-8 py-10">
      <div className="mb-6 flex items-center gap-2 text-red-600">
        <Flame className="h-7 w-7" />
        <h2 className="text-3xl font-semibold">Best Selling!</h2>
      </div>

      <ProductsCarousel
        products={data?.metadata?.products}
        isLoading={isLoading}
      />
    </section>
  );
};

export default BestSellingSection;
