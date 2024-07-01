import { cn } from "@/lib/utils.js";

const PageTitle = ({ className, children }) => {
  return <h1 className={cn("text-3xl font-medium", className)}>{children}</h1>;
};

export default PageTitle;
