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

const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
  // Don't render pagination if there's only one page or page is 0
  if (currentPage === 0 || totalPages < 2) return null;

  const paginationRange = usePagination({ currentPage, totalPages });

  const onNext = () => onPageChange(currentPage + 1);
  const onPrev = () => onPageChange(currentPage - 1);

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={currentPage <= 1 && "pointer-events-none opacity-50"}
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
              <PaginationLink isActive={item === currentPage}>
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages && "pointer-events-none opacity-50"
            }
            onClick={onNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
