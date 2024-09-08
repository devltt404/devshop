import CartItems from "@/components/cart/CartItems.jsx";
import CartSummary from "@/components/cart/CartSummary.jsx";
import LoadingScreen from "@/components/loading/LoadingScreen.jsx";
import { PageDescription, PageTitle } from "@/components/ui/PageTitle.jsx";
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
import { Progress } from "@/components/ui/progress.jsx";
import shopConfig from "@/configs/shop.config.js";
import {
  useClearCartMutation,
  useGetDetailedCartQuery,
} from "@/redux/api/cart.api.js";
import { setNumCartItems } from "@/redux/slices/cart.slice.js";
import { displayPrice } from "@/utils/helper.util.js";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    error,
    refetch: refetchGetCart,
  } = useGetDetailedCartQuery();
  const [clearCart, { isLoading: isClearingCart }] = useClearCartMutation();

  const [cartItems, setCartItems] = useState(null);

  useEffect(() => {
    if (data) {
      setCartItems(data.metadata?.cart?.items || []);
    }
    if (error) {
      setCartItems([]);
    }
  }, [data, error]);

  const subtotal = useMemo(() => {
    return (
      cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0
    );
  }, [cartItems]);

  if (isLoading || isClearingCart) {
    return <LoadingScreen />;
  }

  return (
    <div className="container-area flex gap-16 max-xl:gap-8 max-lg:flex-col max-lg:gap-12">
      <div className="flex-1">
        <PageTitle>Cart</PageTitle>

        {cartItems &&
          (cartItems.length === 0 ? (
            <PageDescription>Your cart is empty.</PageDescription>
          ) : (
            <>
              <div className="relative">
                <PageDescription>
                  You have{" "}
                  <span className="font-semibold">{cartItems?.length}</span>{" "}
                  {cartItems?.length > 1 ? "items" : "item"} in your cart.
                </PageDescription>

                <AlertDialog>
                  <AlertDialogTrigger
                    className="absolute bottom-0 right-0"
                    asChild
                  >
                    <button
                      className="text-destructive hover:underline"
                      disabled={isClearingCart}
                    >
                      Clear cart
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear cart</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to clear your cart? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          clearCart()
                            .unwrap()
                            .then(() => {
                              setCartItems([]);
                              dispatch(setNumCartItems(0));
                            })
                        }
                      >
                        Clear
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Free ship progress  */}
              <div className="mb-4 bg-white px-4 py-6">
                <p className="mb-2">
                  {subtotal < shopConfig.freeShipThreshold ? (
                    <>
                      Add
                      <span className="font-bold">
                        {" "}
                        ${displayPrice(
                          shopConfig.freeShipThreshold - subtotal,
                        )}{" "}
                      </span>
                      more to get free shipping
                    </>
                  ) : (
                    <>
                      Congratulations! You qualify for
                      <span className="font-bold"> Free Shipping</span>
                    </>
                  )}
                </p>

                <Progress
                  className="h-2"
                  value={
                    subtotal < shopConfig.freeShipThreshold
                      ? (subtotal / shopConfig.freeShipThreshold) * 100
                      : 100
                  }
                />
              </div>
              <CartItems cartItems={cartItems} setCartItems={setCartItems} />
            </>
          ))}
      </div>

      {cartItems?.length > 0 && (
        <CartSummary refetchGetCart={refetchGetCart} subtotal={subtotal} />
      )}
    </div>
  );
};

export default CartPage;
