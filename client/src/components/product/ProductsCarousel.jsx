import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";

const ProductsCarousel = ({ products, isLoading }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <ProductCardSkeleton />
              </CarouselItem>
            ))
          : products.map((product) => (
              <CarouselItem key={product._id} className="basis-1/5">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductsCarousel;
