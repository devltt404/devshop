import { cn } from "@/lib/utils.js";
import { Fragment, useEffect, useRef, useState } from "react";

const ProductDetails = ({ details }) => {
  const detailsRef = useRef(null);
  const [showFullDetails, setShowFullDetails] = useState(false);

  useEffect(() => {
    if (showFullDetails) {
      detailsRef.current.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showFullDetails]);

  return (
    <div id="details" ref={detailsRef}>
      <h2 className="mb-2 text-lg font-bold">Details</h2>
      <div className="relative">
        <div
          className={cn(
            "grid grid-cols-[200px_1fr] gap-x-2 gap-y-2 overflow-y-hidden",
            showFullDetails ? "h-auto" : "h-36",
          )}
        >
          {Object.keys(details).map((key, i) => (
            <Fragment key={i}>
              <span className="font-semibold">{key}</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: details[key],
                }}
              />
            </Fragment>
          ))}
        </div>

        {!showFullDetails && (
          <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-white to-transparent"></div>
        )}
      </div>

      {showFullDetails ? (
        <button
          className="mt-1 text-blue-500"
          onClick={() => {
            setShowFullDetails(false);
          }}
        >
          Show less
        </button>
      ) : (
        <button
          className="mt-1 text-blue-500"
          onClick={() => {
            setShowFullDetails(true);
          }}
        >
          Show more
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
