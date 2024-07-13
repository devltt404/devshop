import { cn } from "@/lib/utils.js";

const LoadingSpinner = ({ className }) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "h-28 w-28 rounded-full border-y-[9px] border-primary/30",
          className,
        )}
      ></div>
      <div
        className={cn(
          "absolute left-0 top-0 h-28 w-28 animate-spin rounded-full border-y-[9px] border-primary",
          className,
        )}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
