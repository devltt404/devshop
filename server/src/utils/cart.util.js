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

export async function returnMutatedCart(cart) {
  return {
    cart,
    totalQuantity: await this.getTotalQuantity(cart),
  };
}

export function genFindCartQuery({ userId, guestCartId }) {
  return userId ? { userId } : { _id: guestCartId };
}

export async function validateCartItem({ productId, skuId }) {
  //Validate product
  const product = await ProductService.findProductById({
    productId,
    select: "-description -details",
  });
  if (!product) throw new ErrorResponse(ERROR.CART.INVALID_PRODUCT_ID);

  //Validate sku
  const sku = await SkuService.findSkuById({ skuId });
  if (!sku) throw new ErrorResponse(ERROR.CART.INVALID_SKU_ID);

  return { product, sku };
}

export async function populateCart(cartQuery) {
  const cart = await cartQuery
    .populate("items.product", "-description -details -features")
    .populate("items.sku");

  if (!cart) {
    throw new ErrorResponse(ERROR.CART.INVALID_CART);
  }

  let isAnItemExceedsStock = false;

  const items = cart.items.map((item) => {
    const { product, sku } = item;

    if (sku.stock < item.quantity) {
      item.quantity = sku.stock;
      isAnItemExceedsStock = true;
    }

    return {
      product: product._id,
      slug: product.slug,
      sku: sku._id,
      quantity: item.quantity,
      name: product.name,
      price: sku.price,
      image: sku.images[0] || product.images[0],
      stock: sku.stock,
      variationSelection: getVariationString({ product, sku }),
    };
  });

  if (isAnItemExceedsStock) {
    // Remove items that out of stock
    cart = cart.filter((item) => item.quantity > 0);

    await cart.save();
  }

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping =
    subtotal >= shopConfig.freeShipThreshold ? 0 : shopConfig.shippingFee;

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
