import ms from "ms";
import { COOKIE_KEY } from "../constants/index.js";
import { clearCookie, setCookie } from "./cookie.util.js";

export function setCartCookie({ cartId, res }) {
  setCookie(res, COOKIE_KEY.CART_ID, cartId, {
    maxAge: ms("90d"),
  });
}

export function clearCartCookie(res) {
  clearCookie(res, COOKIE_KEY.CART_ID);
}

export function getCommonCartParams(req) {
  return {
    userId: req.user?._id,
    guestCartId: req.cookies?.cartId,
  };
}

export function getCartItemsQuantity(cart) {
  return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
}

export async function returnMutatedCart(cart) {
  return {
    cart,
    totalQuantity: getCartItemsQuantity(cart),
  };
}

export function genFindCartQuery({ userId, guestCartId }) {
  return userId ? { userId } : { _id: guestCartId };
}
