import { cn } from "@/lib/utils.js";

export const PageTitle = ({ className, children }) => {
  return <h1 className={cn("text-3xl font-medium", className)}>{children}</h1>;
};

export const PageDescription = ({ className, children }) => {
  return (
    <p className={cn("mt-1 text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
};
