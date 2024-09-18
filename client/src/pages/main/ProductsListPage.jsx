import ProductsFilter from "@/components/product/ProductsFilter.jsx";
import ProductsGrid from "@/components/product/ProductsGrid.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useGetProductsQuery } from "@/redux/api/product.api.js";
import _ from "lodash";
import { Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const ProductsListPage = () => {
  const { categorySlug } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const { data, isFetching } = useGetProductsQuery({
    ...query,
    ...(categorySlug && { categoryId: categorySlug.split("-").pop() }),
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
        {!categorySlug && (
          <div className="mb-6 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />

            <p className="text-lg">
              Search results for keyword{" "}
              <span className="font-bold italic">"{query.key}"</span>
            </p>
          </div>
        )}

        {data?.metadata?.products.length === 0 ? (
          <p className="text-2xl text-muted-foreground">No products found.</p>
        ) : (
          <ProductsGrid
            isLoading={isFetching}
            products={data?.metadata?.products}
            sortBy={query.sortBy}
            onSortByChange={(sortBy) => onQueryChange({ sortBy })}
            pagination={data?.metadata?.pagination}
            onPageChange={(newPage) => onQueryChange({ page: newPage })}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsListPage;
