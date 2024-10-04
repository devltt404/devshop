import ms from "ms";
import { COOKIE_KEY } from "../constants/index.js";
import CartService from "../services/cart.service.js";
import { clearCookie, setCookie } from "./cookie.util.js";

export function setCartCookie({ cartId, res }) {
  setCookie(res, COOKIE_KEY.CART_ID, cartId, {
    maxAge: ms("90d"),
  });
}

export function clearCartCookie(res) {
  clearCookie(res, COOKIE_KEY.CART_ID);
}

// Assign the guest cart to the user if the user logged in and does not have a cart.
export async function assignGuestCartToUser({ cartId, userId, res }) {
  const userCart = await CartService.findCartByUserId({ userId });

  if (cartId) {
    if (!userCart) {
      // If the user does not have a cart, assign the guest cart to the user.
      await CartService.updateCartOwner({ cartId, userId });
    } else {
      // If the user has a cart, delete the guest cart.
      CartService.deleteCartById({ cartId });
    }
    clearCartCookie(res);
  }
}

export function getCommonCartParams(req) {
  return {
    userId: req.user?._id,
    guestCartId: req.cookies?.cartId,
  };
}
