import { cn } from "@/lib/utils.js";

const LoadingOverlay = ({ children, isLoading = false }) => {
  return (
    <div className={cn(isLoading && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
};

export default LoadingOverlay;
