import ORDER from "@/constants/order.constant.js";
import { cn } from "@/lib/utils.js";

//-------------------------------------------------------------------------
const badgeVariants = {};
const textContent = {};

badgeVariants[ORDER.STATUS.PENDING] = "bg-yellow-500 text-yellow-100";
badgeVariants[ORDER.STATUS.PROCESSING] = "bg-yellow-300 text-yellow-800";
badgeVariants[ORDER.STATUS.PROCESSED] = "bg-green-500 text-green-100";

textContent[ORDER.STATUS.PENDING] = "Pending";
textContent[ORDER.STATUS.PROCESSING] = "Processing";
textContent[ORDER.STATUS.PROCESSED] = "Processed";
//-------------------------------------------------------------------------

const OrderStatusBadge = ({ status, className }) => {
  return (
    <span
      className={cn(
        `rounded-full px-4 py-1 text-xs font-medium ${badgeVariants[status]}`,
        className,
      )}
    >
      {textContent[status]}
    </span>
  );
};

export default OrderStatusBadge;
