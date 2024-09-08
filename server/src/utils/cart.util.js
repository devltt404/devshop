import CartService from "../services/cart.service.js";

export function setCartCookie({ cartId, res }) {
  res.cookie("cartId", cartId, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 31536000000, // 1 year
  });
}

export function clearCartCookie(res) {
  res.clearCookie("cartId", {
    httpOnly: true,
    sameSite: "strict",
  });
}

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
