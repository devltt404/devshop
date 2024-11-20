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
import { MEDIA_QUERY, PRODUCT_SORT_BY_OPTIONS } from "@/constants/index.js";
import useGetProducts from "@/hooks/useGetProducts.jsx";
import useMediaQuery from "@/hooks/useMediaQuery.jsx";
import { getSortVal } from "@/utils/helper.util.js";
import _ from "lodash";
import { Lightbulb } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const ProductsListPage = () => {
  const isTablet = useMediaQuery(MEDIA_QUERY.TABLET);

  const { categorySlug } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const [catFacet, setCatFacet] = useState(query.catFacet?.split(",") || []);

  const { products, isFetching, pagination, facets } = useGetProducts({
    ...query,
    ...(categorySlug && { categoryId: categorySlug.split("-").pop() }),
    ...(catFacet?.length > 0 && { catFacet: catFacet.join(",") }),
    facet: "category",
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
            categories={facets?.category?.buckets || []}
            catFacet={catFacet}
            setCatFacet={setCatFacet}
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
            value={
              query.sortBy
                ? getSortVal(query.sortBy, query.order)
                : getSortVal(
                    PRODUCT_SORT_BY_OPTIONS[0].sortBy,
                    PRODUCT_SORT_BY_OPTIONS[0].order,
                  )
            }
            onValueChange={(val) => {
              const [sortBy, order] = val.split("-");
              onQueryChange({ sortBy, order });
            }}
          >
            <SelectTrigger className="ml-auto w-[180px] bg-white font-semibold">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PRODUCT_SORT_BY_OPTIONS.map((option) => (
                <SelectItem
                  key={option.sortBy + option.order}
                  value={getSortVal(option.sortBy, option.order)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {products?.length === 0 ? (
          <p className="text-2xl text-muted-foreground">No products found.</p>
        ) : (
          <ProductsGrid
            isLoading={isFetching}
            products={products}
            sortBy={query.sortBy}
            pagination={pagination}
            onPageChange={(newPage) => onQueryChange({ page: newPage })}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsListPage;
