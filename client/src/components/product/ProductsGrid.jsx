import ProductCard from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";

const ProductsGrid = ({ products, isLoading }) => {
  return (
    <>
      <div className="grid grid-cols-5 gap-x-4 gap-y-8">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </>
  );
};

export default ProductsGrid;
