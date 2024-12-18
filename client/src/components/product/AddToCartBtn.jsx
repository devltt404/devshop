import { useAddToCartMutation } from "@/redux/api/cart.api.js";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button.jsx";
import { toast } from "../ui/use-toast.js";

const AddToCartBtn = ({ quantity, productId, skuId }) => {
  const dispatch = useDispatch();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  return (
    <Button
      className="w-full py-6"
      onClick={() => {
        if (!skuId) {
          toast({
            variant: "destructive",
            title: "Uh oh! Invalid variant!",
            description: "Please select a valid variant.",
          });
          return;
        }

        addToCart({
          quantity,
          productId,
          skuId,
        })
          .unwrap()
          .then(() => {
            toast({
              title: "Success!",
              description: "Item added to cart.",
            });
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
      disabled={isLoading}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
};

export default AddToCartBtn;
