import { cn } from "@/lib/utils.js";
import { prescaleImg } from "@/utils/helper.util.js";
import { useState } from "react";

const ImagesPreview = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div>
      <div className="mb-6 flex aspect-square items-center justify-center rounded-lg border-2">
        <img
          src={prescaleImg(images[currentImage], 700, 700)}
          className="max-h-full max-w-full object-contain p-6"
          alt="Selected product image"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.slice(0, 3).map((image, index) => (
          <div
            className={cn(
              "flex aspect-square items-center justify-center rounded-md border-2 p-2",
              currentImage === index ? "border-primary" : "",
            )}
            key={image}
            onMouseEnter={() => {
              setCurrentImage(index);
            }}
          >
            <img
              alt="Product image"
              src={prescaleImg(image, 200, 200)}
              role="group"
              className={"max-h-full max-w-full object-contain transition"}
              aria-roledescription="slide"
            />
          </div>
        ))}

        {images.length > 3 && (
          <button className="flex aspect-square items-center justify-center rounded-md border-2 p-2">
            <div className="text-2xl font-semibold">+{images.length - 3}</div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagesPreview;
