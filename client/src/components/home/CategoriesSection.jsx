import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useGetCategoriesQuery } from "@/redux/api/category.api.js";
import { Link } from "react-router-dom";

const CategoriesSkeleton = () =>
  Array.from({ length: 7 }).map((_, index) => (
    <CarouselItem className="basis-auto" key={index}>
      <div className="inline-flex flex-col items-center gap-2">
        <Skeleton className="h-44 w-52 rounded-md"></Skeleton>
        <Skeleton className="h-[1.75rem] w-full"></Skeleton>
      </div>
    </CarouselItem>
  ));

const CategoriesSection = () => {
  const { data, isLoading } = useGetCategoriesQuery();

  return (
    <section className="container">
      <h2 className="mb-3 text-center text-3xl font-bold text-primary">
        Categories
      </h2>

      <p className="mb-14 text-center text-muted-foreground">
        We offer a wide range of categories to choose from, let's explore!
      </p>

      <Carousel className="w-full">
        <CarouselContent className="gap-4">
          {isLoading ? (
            <CategoriesSkeleton />
          ) : (
            data &&
            data.metadata?.categories?.map((category) => (
              <CarouselItem
                key={category._id}
                className="basis-auto select-none"
              >
                <Link to={`/category/${category.slug}-${category._id}`}>
                  <div className="group inline-flex flex-col items-center gap-2">
                    <div className="inline-flex h-44 w-52 items-center justify-center rounded-md bg-slate-50 p-6">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="transition group-hover:scale-110"
                      />
                    </div>
                    <p className="text-lg font-semibold">{category.name}</p>
                  </div>
                </Link>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default CategoriesSection;
