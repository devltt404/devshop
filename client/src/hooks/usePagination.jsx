import { range } from "lodash";
import { useMemo } from "react";

/**
 * A hook to generate pagination range.
 * @param {Object} pagination - Pagination parameters.
 * @param {number} pagination.totalPages - Total number of pages.
 * @param {number} [pagination.minSiblingCount=1] - Minimum number of siblings to display
 * @param {number} pagination.page - Current page number.
 * @returns {Array} Array of pagination items, each may be a number or null.
 *
 * @example
 * // Case 1: total pages are Less than minPageCountNeedsDots
 * usePagination({ totalPages: 5, page: 1 })
 * // Returns: [1, 2, 3, 4, 5]
 *
 * @example
 * // Case 2: Only needs right dots
 * usePagination({ totalPages: 50, page: 3 })
 * // Returns: [1, 2, 3, 4, 5, null, 50]
 *
 * @example
 * // Case 3: Only needs left dots
 * usePagination({ totalPages: 50, page: 48 })
 * // Returns: [1, null, 46, 47, 48, 49, 50]
 *
 * @example
 * // Case 4: Needs both left and right dots
 * usePagination({ totalPages: 50, page: 25 })
 * // Returns: [1, null, 24, 25, 26, null, 50]
 */
const usePagination = ({ totalPages, minSiblingCount = 1, page }) => {
  const paginationRange = useMemo(() => {
    /*
      Number of minimum pages that need to display with dots equals to 
      minSiblingCount + 5 (firstPage + lastPage + page + 2*dots)
    */
    const minPageCountNeedsDots = minSiblingCount + 5;

    // Case 1: total pages are less than minPageCountNeedsDots
    if (totalPages < minPageCountNeedsDots) {
      return range(1, totalPages + 1);
    }

    const leftSibling = Math.max(page - minSiblingCount, 1);
    const rightSibling = Math.min(page + minSiblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 2;

    // Case 2: Only needs right dots
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * minSiblingCount;
      return [...range(1, leftItemCount + 1), null, totalPages];
    }

    // Case 3: Only needs left dots
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * minSiblingCount;
      return [
        1,
        null,
        ...range(totalPages - rightItemCount + 1, totalPages + 1),
      ];
    }

    // Case 4: Needs both left and right dots
    if (showLeftDots && showRightDots) {
      return [
        1,
        null,
        ...range(leftSibling, rightSibling + 1),
        null,
        totalPages,
      ];
    }
  }, [totalPages, minSiblingCount, page]);

  return paginationRange;
};

export default usePagination;
