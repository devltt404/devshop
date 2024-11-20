import { useGetProductsQuery } from "@/redux/api/product.api.js";
import { useMemo } from "react";

const useGetProducts = (params) => {
  const { data, isLoading, isError, isFetching, error } =
    useGetProductsQuery(params);
  const products = useMemo(() => {
    return isError ? [] : data?.metadata?.products;
  }, [data, isError]);

  return {
    isLoading,
    isError,
    isFetching,
    error,
    products,
    pagination: data?.metadata?.pagination,
    facets: data?.metadata?.facets,
  };
};

export default useGetProducts;
