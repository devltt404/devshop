import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { displayPrice } from "@/utils/helper.util.js";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator.jsx";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}-${product._id}?skuId=${product.defaultSku._id}`}
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-md border bg-white transition hover:shadow-md">
        <img
          className="aspect-square select-none object-contain py-8 transition group-hover:scale-105"
          src={product.defaultSku.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />

        <div className="flex flex-1 flex-col px-4 pb-4">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="text-left">
                <p className="line-clamp-2 font-semibold">{product.name}</p>
              </TooltipTrigger>

              <TooltipContent>
                <p>{product.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="my-[4px] flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-orange-400" strokeWidth={0} />
            <span className="font-semibold">
              {product.avgRating.toFixed(1)}
            </span>
            <Separator
              orientation="vertical"
              className="mx-1 h-3 bg-gray-400"
            />
            <span className="text-muted-foreground">
              {product.numSold} sold
            </span>
          </div>

          <div className="mb-2 mt-auto flex items-center gap-2">
            <p className="text-lg font-bold text-red-600">
              ${displayPrice(product.defaultSku.price)}
            </p>
            <p className="text-xs text-muted-foreground line-through">
              ${displayPrice(product.defaultSku.originalPrice)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
