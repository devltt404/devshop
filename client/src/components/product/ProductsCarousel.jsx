import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";

const ProductsCarouselItem = ({ children }) => (
  <CarouselItem className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 xl:pl-6 max-md:w-56 max-md:basis-auto">
    {children}
  </CarouselItem>
);

const ProductsCarousel = ({ products, isLoading }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-4 xl:-ml-6">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <ProductsCarouselItem key={index}>
                <ProductCardSkeleton />
              </ProductsCarouselItem>
            ))
          : products?.map((product) => (
              <ProductsCarouselItem key={product._id}>
                <ProductCard product={product} />
              </ProductsCarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ProductsCarousel;
