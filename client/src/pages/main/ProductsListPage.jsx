import ProductsFilter from "@/components/product/ProductsFilter.jsx";
import ProductsGrid from "@/components/product/ProductsGrid.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useGetProductsQuery } from "@/redux/api/product.api.js";
import _ from "lodash";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const { data, isFetching } = useGetProductsQuery({
    ...query,
    limit: 8,
  });

  const onQueryChange = (newParams) => {
    setSearchParams({ ...query, ...newParams });
  };

  const onClearQuery = () => {
    setSearchParams(_.pick(query, ["page", "key", "sortBy"]));
  };

  return (
    <div className="container-area flex items-start gap-12">
      <ProductsFilter
        query={query}
        onQueryChange={onQueryChange}
        onClearQuery={onClearQuery}
      />
      <Separator
        orientation="vertical"
        className="h-auto self-stretch bg-gray-100"
      />
      <div className="flex-1">
        {data?.metadata?.products.length === 0 ? (
          <p className="text-2xl text-muted-foreground">No products found.</p>
        ) : (
          <ProductsGrid
            isLoading={isFetching}
            products={data?.metadata?.products}
            sortBy={query.sortBy}
            onSortByChange={(sortBy) => onQueryChange({ sortBy })}
            pagination={data?.metadata?.pagination}
            onPageChange={(page) => onQueryChange({ page })}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsList;
