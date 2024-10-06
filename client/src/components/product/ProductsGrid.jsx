import CustomPagination from "../ui/CustomPagination.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";

const ProductsGrid = ({ products, isLoading, pagination, onPageChange }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {!isLoading && (
        <CustomPagination onPageChange={onPageChange} {...pagination} />
      )}
    </div>
  );
};

export default ProductsGrid;
