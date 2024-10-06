import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const ProductFeatures = React.memo(({ features }) => {
  return (
    <Accordion className="max-md:px-6" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-2xl font-bold">
          Product Features
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc text-base">
            {features.map((feature, index) => (
              <li
                key={index}
                className="ml-6 pb-3"
                dangerouslySetInnerHTML={{ __html: feature }}
              ></li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

export default ProductFeatures;
