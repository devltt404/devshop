import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "@/redux/api/cart.api.js";
import { decrementNumCartItems } from "@/redux/slices/cart.slice.js";
import { displayPrice } from "@/utils/helper.util.js";
import { Trash } from "lucide-react";
import { Fragment, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LoadingOverlay from "../loading/LoadingOverlay.jsx";
import { Button } from "../ui/button.jsx";
import { toast } from "../ui/use-toast.js";
import CartQuantityInput from "./CartQuantityInput.jsx";

const CartItems = ({ cartItems, setCartItems }) => {
  const dispatch = useDispatch();

  const [updateQuantity, { isLoading: isUpdatingQuantity }] =
    useUpdateCartItemQuantityMutation();
  const [removeCartItem, { isLoading: isRemovingItem }] =
    useRemoveCartItemMutation();

  const deleteAlertTriggerRef = useRef(null);

  const handleRemoveCartItem = (cartItem) => {
    removeCartItem({
      productId: cartItem.productId,
      itemId: cartItem.itemId,
    }).then(() => {
      toast({
        title: "Item removed from cart",
        description: `${cartItem.name} has been removed from your cart.`,
      });

      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            item.productId !== cartItem.productId &&
            item.itemId !== cartItem.itemId,
        ),
      );
      dispatch(decrementNumCartItems());
    });
  };

  return (
    <LoadingOverlay isLoading={isRemovingItem || isUpdatingQuantity}>
      <div className="grid flex-1 grid-cols-[6rem,1fr,8rem] gap-y-8 border-gray-100 py-4">
        {cartItems.map((cartItem, index) => {
          return (
            <Fragment key={cartItem.itemId || cartItem.productId}>
              <Link
                className="self-center"
                to={`/product/${cartItem.slug}-${cartItem.productId}`}
              >
                <img
                  src={cartItem.image}
                  alt={cartItem.name}
                  className="h-24 w-24 object-contain"
                />
              </Link>

              <div className="me-10 flex justify-between gap-6 px-6 max-xl:me-4 max-xl:flex-col">
                <div>
                  <Link to={`/product/${cartItem.slug}-${cartItem.productId}`}>
                    <h3 className="line-clamp-2 text-lg font-medium">
                      {cartItem.name}
                    </h3>
                    {cartItem.type === "configurable" && (
                      <p className="mt-1 text-sm text-gray-500">
                        {Object.values(cartItem.variationSelection).join(" - ")}
                      </p>
                    )}
                  </Link>
                </div>

                <CartQuantityInput
                  deleteAlertTriggerRef={deleteAlertTriggerRef}
                  setCartItems={setCartItems}
                  index={index}
                  productId={cartItem.productId}
                  itemId={cartItem.itemId}
                  updateQuantity={updateQuantity}
                  quantity={cartItem.quantity}
                  stock={cartItem.stock}
                />
              </div>

              <div className="flex flex-col justify-between text-right">
                <p className="truncate text-xl font-medium">
                  ${displayPrice(cartItem.price * cartItem.quantity)}
                </p>
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger ref={deleteAlertTriggerRef} asChild>
                      <Button size="icon" variant="outline">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete cart item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this cart item from
                          your cart?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveCartItem(cartItem)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </LoadingOverlay>
  );
};

export default CartItems;