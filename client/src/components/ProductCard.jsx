import { Star } from "lucide-react";
import { Separator } from "./ui/separator.jsx";

export default function ProductCard() {
  return (
    <div className="hover:shadow-outer group flex w-64 flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-black transition hover:border-black">
      <img
        className="aspect-square object-contain py-8 transition group-hover:scale-105"
        src="https://cdn.tgdd.vn/Products/Images/7077/306530/befit-watch-fit-hong-tn-600x600.jpg"
        alt=""
      />

      <div className="px-4 pb-4">
        <p className="text-sm text-muted-foreground">Phone</p>
        <p className="line-clamp-2 text-xl font-medium">Product Name</p>

        <div className="my-1 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-orange-400" strokeWidth={0} />
          <span className="font-medium">5.0</span>
          <Separator orientation="vertical" className="mx-1 h-3 bg-gray-400" />
          <span className="text-muted-foreground">10 sold</span>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <p className="text-xl font-semibold">$100.00</p>
          <p className="text-sm text-muted-foreground line-through">$255.00</p>
        </div>
      </div>
    </div>
  );
}
