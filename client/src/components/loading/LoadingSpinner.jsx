import { cn } from "@/lib/utils.js";

const LoadingSpinner = ({ className }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative">
        <div
          className={cn(
            "h-28 w-28 rounded-full border-b-[9px] border-t-[9px] border-gray-300",
            className,
          )}
        ></div>
        <div className="absolute left-0 top-0 h-28 w-28 animate-spin rounded-full border-b-[9px] border-t-[9px] border-black"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
