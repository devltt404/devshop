import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { toast } from "../ui/use-toast.js";

const ProductQuantity = ({ quantity, setQuantity, stock }) => {
  const handleSetQuantity = (newQuantity) => {
    if (!newQuantity || newQuantity < 1) return setQuantity(1);
    if (newQuantity > stock) {
      toast({
        title: "Not enough stock",
        description: `Only ${stock} items left in stock`,
      });
      return setQuantity(stock);
    }
    setQuantity(newQuantity);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={quantity === 1}
        onClick={() => handleSetQuantity(quantity - 1)}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        className="inline-block h-10 w-12 text-center"
        value={quantity}
        onChange={(e) => {
          handleSetQuantity(e.target.value);
        }}
      />

      <Button
        variant="outline"
        size="icon"
        disabled={quantity === stock}
        onClick={() => handleSetQuantity(quantity + 1)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductQuantity;
