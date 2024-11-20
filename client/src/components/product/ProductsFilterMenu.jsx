import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button.jsx";
import { Separator } from "../ui/separator.jsx";
import RatingRow from "./RatingRow.jsx";

const ProductsFilterMenu = ({
  query,
  onQueryChange,
  onClearQuery,
  className,
  categories,
  catFacet,
  setCatFacet,
}) => {
  const [minPriceInp, setMinPriceInp] = useState(null);
  const [maxPriceInp, setMaxPriceInp] = useState(null);

  const handleApplyPrice = () => {
    if (minPriceInp != "") onQueryChange({ minPrice: minPriceInp });
    if (maxPriceInp != "") onQueryChange({ maxPrice: maxPriceInp });
  };

  useEffect(() => {
    setMinPriceInp(query.minPrice || "");
    setMaxPriceInp(query.maxPrice || "");
  }, [query]);

  return (
    <div className={className}>
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Filter className="h-5 w-5" />
        Filter
      </h2>

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]}>
        {/* Category */}
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-semibold">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex select-none flex-col gap-2">
              {categories.map((category, index) => (
                <li key={index} className="flex items-center">
                  <Checkbox
                    id={category.key}
                    checked={catFacet.includes(category.key)}
                    onCheckedChange={(checked) => {
                      setCatFacet((prev) => {
                        const newCatFacet = [...prev];
                        if (checked) {
                          newCatFacet.push(category.key);
                        } else {
                          newCatFacet.splice(
                            newCatFacet.indexOf(category.key),
                            1,
                          );
                        }
                        return newCatFacet;
                      });
                    }}
                  />
                  <Label
                    className="ml-2 mt-1 font-medium"
                    htmlFor={category.key}
                  >
                    {category.name}
                  </Label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="item-2">
          <AccordionTrigger>Min Rating</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              className="gap-3"
              value={Number(query.minRating)}
              onValueChange={(val) => {
                onQueryChange({ minRating: val });
              }}
            >
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating} id={rating} />
                  <label className="cursor-pointer" htmlFor={rating}>
                    <RatingRow rating={rating} />
                  </label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="item-3">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 grid max-w-full grid-cols-[1fr_1rem_1fr] items-center gap-2">
              <input
                className="min-w-0 rounded-sm border px-2 py-2 text-sm"
                type="number"
                placeholder="Min"
                value={minPriceInp}
                onChange={(e) => setMinPriceInp(e.target.value)}
              />
              <Separator className="w-4 bg-gray-300" />
              <input
                className="min-w-0 rounded-sm border px-2 py-2 text-sm"
                type="number"
                placeholder="Max"
                value={maxPriceInp}
                onChange={(e) => setMaxPriceInp(e.target.value)}
              />
            </div>
            <Button className="w-full" size="sm" onClick={handleApplyPrice}>
              Apply
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="mt-4 w-full"
        variant="secondary"
        size="sm"
        onClick={onClearQuery}
      >
        Clear All
      </Button>
    </div>
  );
};

export default ProductsFilterMenu;
