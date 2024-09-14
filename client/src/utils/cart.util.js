import { setTotalQuantity } from "@/redux/slices/cart.slice.js";

export const mutateCart = async ({
  mutationFunc,
  dispatch,
  setCartItems,
}) => {
  mutationFunc()
    .unwrap()
    .then(({ metadata: { cart, totalQuantity } }) => {
      dispatch(setTotalQuantity(totalQuantity));
      setCartItems(cart?.items || []);
    });
};
