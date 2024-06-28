import CartItems from "@/components/cart/CartItems.jsx";
import CartSummary from "@/components/cart/CartSummary.jsx";
import LoadingArea from "@/components/loading/LoadingArea.jsx";
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
  useClearCartMutation,
  useGetDetailedCartQuery,
} from "@/redux/api/cart.api.js";
import { setNumCartItems } from "@/redux/slices/cart.slice.js";
import { useEffect, useState } from "react";
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
    if (data && !cartItems) {
      setCartItems(data.metadata?.cart?.items);
    }
  }, [data]);

  useEffect(() => {
    error && setCartItems([]);
  }, [error]);

  if (isLoading || isClearingCart) {
    return <LoadingArea />;
  }

  return (
    <div className="py-container container flex gap-16 max-xl:gap-8 max-lg:flex-col max-lg:gap-12">
      <div className="flex-1">
        <div className="relative">
          <h1 className="mb-2 text-3xl font-semibold">My Cart</h1>
          {cartItems?.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <>
              <p className="text-muted-foreground">
                You have{" "}
                <span className="font-medium">{cartItems?.length}</span>{" "}
                {cartItems?.length > 1 ? "items" : "item"} in your cart.
              </p>

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
                      Are you sure you want to clear your cart? This action can
                      not be undone.
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
            </>
          )}
        </div>
        {cartItems?.length > 0 && (
          <CartItems cartItems={cartItems} setCartItems={setCartItems} />
        )}
      </div>

      {cartItems?.length > 0 && (
        <CartSummary
          refetchGetCart={refetchGetCart}
          subtotal={cartItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
          }, 0)}
        />
      )}
    </div>
  );
};

export default CartPage;