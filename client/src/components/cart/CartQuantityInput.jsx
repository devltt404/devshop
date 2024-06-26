import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "../ui/use-toast.js";

const CartQuantityInput = ({
  deleteAlertTriggerRef,
  quantity,
  stock,
  updateQuantity,
  productId,
  itemId,
  setCartItems,
  index,
}) => {
  const [displayQuantity, setDisplayQuantity] = useState(Number(quantity));

  const handleUpdateQuantity = (newQuantity) => {
    updateQuantity({ quantity: newQuantity, productId, itemId })
      .unwrap()
      .then(() => {
        setDisplayQuantity(newQuantity);
        setCartItems((prevCartItems) => {
          const newCartItems = [...prevCartItems];
          newCartItems[index] = {
            ...newCartItems[index],
            quantity: newQuantity,
          };
          return newCartItems;
        });
      });
  };

  return (
    <div className="flex h-fit w-fit items-center rounded-md border border-gray-200 px-2 py-2 shadow-black transition focus-within:border-black focus-within:shadow-outer">
      <button
        className="text-gray-400 transition hover:text-black"
        onClick={() => {
          if (quantity > 1) {
            handleUpdateQuantity(quantity - 1);
          } else {
            deleteAlertTriggerRef.current?.click();
          }
        }}
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="text"
        className="mx-1 w-6 bg-transparent text-center text-sm outline-none"
        value={displayQuantity}
        onChange={(e) => {
          if (/^(?!0)\d*$/.test(e.target.value)) {
            setDisplayQuantity(e.target.value);
          }
        }}
        onBlur={() => {
          const newQuantity = Number(displayQuantity);
          if (newQuantity > stock) {
            toast({
              title: "Insufficient stock",
              description: `The quantity you entered exceeds the available stock of ${stock}.`,
            });
            handleUpdateQuantity(stock);
          } else if (newQuantity < 1) {
            toast({
              title: "Invalid quantity",
              description: "The quantity must be at least 1.",
            });
            handleUpdateQuantity(1);
          } else {
            handleUpdateQuantity(newQuantity);
          }
        }}
      />

      <button
        className="text-gray-400 transition [&:not(:disabled)]:hover:text-black"
        onClick={() => handleUpdateQuantity(quantity + 1)}
        disabled={quantity === stock}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartQuantityInput;
