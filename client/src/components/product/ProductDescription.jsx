import { ChevronDown, ChevronUp } from "lucide-react";
import React, { Fragment, useState } from "react";
import { Separator } from "../ui/separator.jsx";

const ProductDescription = React.memo(({ product }) => {
  const [showDetails, setShowDetails] = useState(
    Object.keys(product.details).slice(0, 4),
  );

  return (
    <div className="grid grid-cols-1 gap-10 py-20 lg:grid-cols-[40%_1fr] max-md:px-6">
      <div>
        <p className="mb-4 text-3xl font-bold">{product.name}</p>
        <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
      </div>

      <div className="rounded-xl bg-white shadow-block px-10 pb-6 pt-8">
        {showDetails.map((key, i) => (
          <Fragment key={key}>
            <div className="grid grid-cols-[40%_1fr] gap-4">
              <p className="font-bold">{key}</p>
              <p>{product.details[key]}</p>
            </div>
            {i !== showDetails.length - 1 && <Separator className="my-6" />}
          </Fragment>
        ))}

        <button
          className="transiiton mt-6 flex w-full items-center justify-center gap-1 text-gray-500 hover:text-black"
          onClick={() => {
            setShowDetails(
              showDetails.length === Object.keys(product.details).length
                ? Object.keys(product.details).slice(0, 4)
                : Object.keys(product.details),
            );
          }}
        >
          {showDetails.length === Object.keys(product.details).length ? (
            <>
              <p className="font-medium">Show less</p>
              <ChevronUp className="h-6 w-6" />
            </>
          ) : (
            <>
              <p className="font-medium">Show more</p>
              <ChevronDown className="h-6 w-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
});

export default ProductDescription;
