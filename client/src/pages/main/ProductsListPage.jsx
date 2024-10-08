import MobileProductsFilter from "@/components/product/MobileProductsFilter.jsx";
import ProductsFilterMenu from "@/components/product/ProductsFilterMenu.jsx";
import ProductsGrid from "@/components/product/ProductsGrid.jsx";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { MEDIA_QUERY, PRODUCT } from "@/constants/index.js";
import useMediaQuery from "@/hooks/useMediaQuery.jsx";
import { useGetProductsQuery } from "@/redux/api/product.api.js";
import _ from "lodash";
import { Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const ProductsListPage = () => {
  const isTablet = useMediaQuery(MEDIA_QUERY.TABLET);

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
    <div className="page-spacer container flex items-start gap-8 xl:gap-12">
      {!isTablet && (
        <>
          <ProductsFilterMenu
            className="w-48"
            query={query}
            onQueryChange={onQueryChange}
            onClearQuery={onClearQuery}
          />

          <Separator
            orientation="vertical"
            className="h-auto self-stretch bg-gray-200"
          />
        </>
      )}
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

        <div className="mb-6 flex">
          {isTablet && (
            <MobileProductsFilter
              query={query}
              onQueryChange={onQueryChange}
              onClearQuery={onClearQuery}
            />
          )}

          <Select
            value={query.sortBy || PRODUCT.SORT_BY_OPTIONS[0].value}
            onValueChange={(sortBy) => onQueryChange({ sortBy })}
          >
            <SelectTrigger className="ml-auto w-[180px] font-semibold bg-white">
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
        {data?.metadata?.products.length === 0 ? (
          <p className="text-2xl text-muted-foreground">No products found.</p>
        ) : (
          <ProductsGrid
            isLoading={isFetching}
            products={data?.metadata?.products}
            sortBy={query.sortBy}
            pagination={data?.metadata?.pagination}
            onPageChange={(newPage) => onQueryChange({ page: newPage })}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsListPage;
