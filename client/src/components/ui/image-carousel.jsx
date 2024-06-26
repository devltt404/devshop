"use client";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ImageCarouselContext = React.createContext(null);

function useImageCarousel() {
  const context = React.useContext(ImageCarouselContext);

  if (!context) {
    throw new Error("useImageCarousel must be used within a <ImageCarousel />");
  }

  return context;
}

const ImageCarousel = React.forwardRef(
  (
    {
      orientation = "horizontal",
      opts,
      data,
      setApi,
      plugins,
      className,
      children,
      images,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);

    const onSelect = React.useCallback((api) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <ImageCarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div className="mb-4 aspect-square">
          <img src={images[currentImage]} className="object-cover" />
        </div>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          <ImageCarouselContent>
            {images.map((image, index) => (
              <ImageCarouselItem
                isSelected={currentImage === index}
                key={index}
                image={image}
                onMouseOver={() => {
                  setCurrentImage(index);
                }}
              />
            ))}
          </ImageCarouselContent>

          <ImageCarouselPrevious />
          <ImageCarouselNext />
        </div>
      </ImageCarouselContext.Provider>
    );
  },
);
ImageCarousel.displayName = "ImageCarousel";

const ImageCarouselContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useImageCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
ImageCarouselContent.displayName = "ImageCarouselContent";

const ImageCarouselItem = React.forwardRef(
  ({ className, image, isSelected, ...props }, ref) => {
    const { orientation } = useImageCarousel();

    return (
      <div
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-1/5 select-none",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className,
        )}
      >
        <img
          src={image}
          ref={ref}
          role="group"
          className={cn(
            "border-2 transition",
            isSelected ? "border-primary" : "border-transparent",
          )}
          aria-roledescription="slide"
          {...props}
        />
      </div>
    );
  },
);
ImageCarouselItem.displayName = "ImageCarouselItem";

const ImageCarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useImageCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
ImageCarouselPrevious.displayName = "ImageCarouselPrevious";

const ImageCarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useImageCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
ImageCarouselNext.displayName = "ImageCarouselNext";

export {
  ImageCarousel,
  ImageCarouselContent,
  ImageCarouselItem,
  ImageCarouselNext,
  ImageCarouselPrevious,
};
