import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.jsx";
import Autoplay from "embla-carousel-autoplay";
import { Package, Truck } from "lucide-react";

const headlineConfig = [
  {
    icon: <Truck className="mr-2 inline-block h-5 w-5 stroke-[1.5px]" />,
    desc: (
      <span>
        Free ship for order <span className="font-semibold">100$ </span>or
        more!!
      </span>
    ),
  },
  {
    icon: <Package className="mr-2 inline-block h-5 w-5 stroke-[1.5px]" />,
    desc: (
      <span>
        Free return for order within{" "}
        <span className="font-semibold">30 days</span>
      </span>
    ),
  },
];

export default function Headline() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
      orientation="vertical"
      className="w-full bg-primary py-2 text-center text-sm text-white"
    >
      <CarouselContent className="-mt-1 h-7">
        {headlineConfig.map((item, index) => (
          <CarouselItem key={index} className="pt-1">
            <div className="flex items-center justify-center p-1">
              {item.icon}
              <span>{item.desc}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
