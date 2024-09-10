import { useAddToCartMutation } from "@/redux/api/cart.api.js";
import { setNumCartItems } from "@/redux/slices/cart.slice.js";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button.jsx";
import { toast } from "../ui/use-toast.js";

const AddToCartBtn = ({ quantity, productId, itemId }) => {
  const dispatch = useDispatch();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  return (
    <Button
      className="mt-4 w-full py-6"
      onClick={() => {
        addToCart({
          quantity,
          productId,
          itemId,
        })
          .unwrap()
          .then(({ metadata }) => {
            toast({
              description: `Added ${quantity} to cart!`,
            });
            dispatch(setNumCartItems(metadata.cart?.items.length));
          })
          .catch((error) => {
            if (error.code === "cart-001") {
              toast({
                variant: "destructive",
                title: "Uh oh! Insufficient stock!",
                description: error.message,
              });
            }
          });
      }}
      disabled={isLoading || !itemId}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
};

export default AddToCartBtn;
