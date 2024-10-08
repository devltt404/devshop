import CartItems from "@/components/cart/CartItems.jsx";
import CartSummary from "@/components/cart/CartSummary.jsx";
import LoadingScreen from "@/components/loading/LoadingScreen.jsx";
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
import { PageDescription, PageTitle } from "@/components/ui/PageTitle.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import shopConfig from "@/configs/shop.config.js";
import {
  useClearCartMutation,
  useGetDetailedCartQuery,
} from "@/redux/api/cart.api.js";
import { mutateCart } from "@/utils/cart.util.js";
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
    <div className="page-spacer">
      <div className="container">
        <PageTitle>Cart</PageTitle>
        {cartItems?.length === 0 ? (
          <PageDescription>Your cart is empty.</PageDescription>
        ) : (
          <PageDescription>
            You have <span className="font-semibold">{cartItems?.length}</span>{" "}
            {cartItems?.length > 1 ? "items" : "item"} in your cart.
          </PageDescription>
        )}
      </div>

      {cartItems?.length > 0 && (
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:container lg:grid-cols-[1fr_24rem]">
          <div>
            <div className="mb-4 rounded-md bg-white px-4 py-6 md:px-8">
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

            <div className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="mb-2 mr-2 text-destructive hover:underline"
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
                        mutateCart({
                          mutationFunc: clearCart,
                          dispatch,
                          setCartItems,
                        })
                      }
                    >
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <CartItems cartItems={cartItems} setCartItems={setCartItems} />
          </div>

          <CartSummary refetchGetCart={refetchGetCart} subtotal={subtotal} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
