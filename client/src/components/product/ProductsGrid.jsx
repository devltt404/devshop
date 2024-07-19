import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT } from "@/constants/index.js";
import CustomPagination from "../ui/CustomPagination.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";

const ProductsGrid = ({
  products,
  isLoading,
  pagination,
  onPageChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div>
      <div className="mb-6">
        <Select value={sortBy || PRODUCT.SORT_BY_OPTIONS[0].value} onValueChange={onSortByChange}>
          <SelectTrigger className="ml-auto w-[180px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {PRODUCT.SORT_BY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-6">
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
