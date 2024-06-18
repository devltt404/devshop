import { Skeleton } from "../ui/skeleton.jsx";

const ProductCardSkeleton = () => {
  return (
    <Skeleton className="rounded-md bg-gray-200">
      <div className="aspect-square py-8" />
      <div className="h-32"></div>
    </Skeleton>
  );
};

export default ProductCardSkeleton;
