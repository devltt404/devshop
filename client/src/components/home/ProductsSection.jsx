import { cva } from "class-variance-authority";
import { forwardRef } from "react";

export const ProductsSectionTitle = forwardRef(
  ({ className, ...props }, ref) => {
    return <h2 ref={ref} className="mb-6 text-3xl font-semibold" {...props} />;
  },
);

const productsSectionVariants = cva("my-16 px-8", {
  variants: {
    variant: {
      default: "",
      muted: "bg-muted py-10 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const ProductsSection = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <section
        className={productsSectionVariants({ variant })}
        {...props}
        ref={ref}
      />
    );
  },
);
