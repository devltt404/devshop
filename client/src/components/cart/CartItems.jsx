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
import { mutateCart } from "@/utils/cart.util.js";
import { displayPrice } from "@/utils/helper.util.js";
import { Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LoadingOverlay from "../loading/LoadingOverlay.jsx";
import { Button } from "../ui/button.jsx";
import CartQuantityInput from "./CartQuantityInput.jsx";

const CartItems = ({ cartItems, setCartItems }) => {
  const dispatch = useDispatch();

  const [updateQuantity, { isLoading: isUpdatingQuantity }] =
    useUpdateCartItemQuantityMutation();
  const [removeCartItem, { isLoading: isRemovingItem }] =
    useRemoveCartItemMutation();

  const [deleteAlertOpen, setDeleteAlertOpen] = useState({
    ...cartItems.map((item) => ({
      [item.sku]: false,
    })),
  });

  return (
    <LoadingOverlay isLoading={isRemovingItem || isUpdatingQuantity}>
      <div className="grid flex-1 grid-cols-[auto_1fr_auto] gap-y-10 rounded-lg border-gray-100 bg-white shadow-block px-4 py-6">
        {cartItems.map((cartItem, index) => {
          return (
            <Fragment key={cartItem.sku}>
              <Link
                className=""
                to={`/product/${cartItem.slug}-${cartItem.product}`}
              >
                <img
                  src={cartItem.image}
                  alt={`${cartItem.name} thumbnail`}
                  className="aspect-square w-16 object-contain p-2 md:w-24"
                />
              </Link>

              <div className="flex flex-col gap-4 px-6">
                <div>
                  <Link to={`/product/${cartItem.slug}-${cartItem.product}`}>
                    <h3 className="line-clamp-2 text-base font-semibold md:text-lg">
                      {cartItem.name}
                    </h3>

                    {cartItem.variationSelection && (
                      <p className="mt-1 text-sm text-gray-500">
                        {cartItem.variationSelection}
                      </p>
                    )}
                  </Link>
                </div>

                <p className="text-xl font-semibold">
                  ${displayPrice(cartItem.price * cartItem.quantity)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                <AlertDialog
                  open={deleteAlertOpen[cartItem.sku]}
                  onDismiss={() => {
                    setDeleteAlertOpen((prev) => {
                      const newOpen = [...prev];
                      newOpen[index] = false;
                      return newOpen;
                    });
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button size="icon" className="h-9 w-9" variant="outline">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete {cartItem.name}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this cart item from your
                        cart?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          mutateCart({
                            mutationFunc: () =>
                              removeCartItem({
                                productId: cartItem.product,
                                skuId: cartItem.sku,
                              }),
                            dispatch,
                            setCartItems,
                          })
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <CartQuantityInput
                  openDeleteAlert={() => {
                    setDeleteAlertOpen((prev) => {
                      return {
                        ...prev,
                        [cartItem.sku]: true,
                      };
                    });
                  }}
                  setCartItems={setCartItems}
                  index={index}
                  productId={cartItem.product}
                  skuId={cartItem.sku}
                  updateQuantity={updateQuantity}
                  quantity={cartItem.quantity}
                  stock={cartItem.stock}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </LoadingOverlay>
  );
};

export default CartItems;
