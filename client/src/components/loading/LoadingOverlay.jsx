import { cn } from "@/lib/utils.js";

const LoadingOverlay = ({ children, isLoading }) => {
  return (
    <div className={cn(isLoading && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
};

export default LoadingOverlay;
