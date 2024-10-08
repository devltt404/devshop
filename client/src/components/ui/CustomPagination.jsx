import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/usePagination.jsx";

const CustomPagination = ({ totalPages, page, onPageChange }) => {
  // Don't render pagination if there's only one page or page is 0
  if (page === 0 || totalPages < 2) return null;

  const paginationRange = usePagination({ page, totalPages });

  const onNext = () => onPageChange(page + 1);
  const onPrev = () => onPageChange(page - 1);

  return (
    <Pagination className="mt-8">
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious
            className={page <= 1 && "pointer-events-none opacity-50"}
            onClick={onPrev}
          />
        </PaginationItem>

        {paginationRange.map((item, index) => {
          if (item === null)
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );

          return (
            <PaginationItem key={index} onClick={() => onPageChange(item)}>
              <PaginationLink isActive={item === page}>{item}</PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className={page === totalPages && "pointer-events-none opacity-50"}
            onClick={onNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
