import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { toast } from "../ui/use-toast.js";

const ProductQuantity = ({ quantity, setQuantity, stock }) => {
  return (
    <div className="flex gap-2 ">
      <Button
        variant="outline"
        size="icon"
        disabled={quantity === 1}
        onClick={() => setQuantity(quantity - 1)}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>

      <Input
        type="text"
        className="h-10 w-12 text-center"
        value={quantity}
        onChange={(e) => {
          if (/^(?!0)\d*$/.test(e.target.value)) {
            setQuantity(e.target.value);
          }
        }}
        maxLength={3}
        onBlur={() => {
          const newQuantity = Number(quantity);
          if (newQuantity > stock) {
            toast({
              title: "Not enough stock",
              description: `Only ${stock} items left in stock`,
            });
            return setQuantity(stock);
          } else if (newQuantity < 1) setQuantity(1);
          else {
            setQuantity(newQuantity);
          }
        }}
      />

      <Button
        variant="outline"
        size="icon"
        disabled={quantity === stock}
        onClick={() => setQuantity(quantity + 1)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductQuantity;
