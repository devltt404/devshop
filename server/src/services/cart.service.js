import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import CartModel from "../models/cart.model.js";
import {
  clearCartCookie,
  genFindCartQuery,
  populateCart,
  returnMutatedCart,
  setCartCookie,
  validateCartItem,
} from "../utils/cart.util.js";

export default class CartService {
  static async findCartByUserId({ userId, lean = true }) {
    return CartModel.findOne({ userId }).lean(lean);
  }

  static async updateCartOwner({ cartId, userId }) {
    return CartModel.findByIdAndUpdate(cartId, { userId });
  }

  static async deleteCartById({ cartId }) {
    return await CartModel.findByIdAndDelete(cartId);
  }

  static async getSimpleCart({ userId, guestCartId, res }) {
    const cart = await CartModel.findOne(
      genFindCartQuery({ userId, guestCartId })
    ).lean();

    //Clear cart cookie if guest cart is not found
    if (!userId && guestCartId && !cart) {
      clearCartCookie(res);
    }

    return {
      cart: {
        totalQuantity:
          cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
      },
    };
  }

  static async getCartDetail({ userId, guestCartId }) {
    const cart = await populateCart(
      CartModel.findOne(genFindCartQuery({ userId, guestCartId }))
    );

    return {
      cart,
    };
  }

  static async addToCart({
    userId,
    productId,
    skuId,
    quantity,
    guestCartId,
    res,
  }) {
    const {
      sku: { stock },
    } = await validateCartItem({
      productId,
      skuId,
    });
    let cart = await CartModel.findOne(
      genFindCartQuery({ userId, guestCartId })
    );

    if (!cart) {
      if (userId) {
        cart = new CartModel({ userId, items: [] });
      } else {
        cart = new CartModel({ items: [] });
        setCartCookie({ res, cartId: cart._id });
      }
    }

    const existingItem = cart.items.find((item) => {
      return item.product == productId && item.sku == skuId;
    });

    const newQuantity = (existingItem?.quantity || 0) + quantity;
    if (newQuantity > stock)
      throw new ErrorResponse(ERROR.CART.INSUFFICIENT_STOCK({ stock }));

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, sku: skuId, quantity });
    }

    await cart.save();
    return returnMutatedCart(cart);
  }

  static async updateCartItemQuantity({
    userId,
    guestCartId,
    quantity,
    productId,
    skuId,
  }) {
    if (quantity < 1) throw new BadRequestError("Quantity must be at least 1.");
    const { sku } = await validateCartItem({ productId, skuId });

    if (quantity > sku.stock) {
      throw new ErrorResponse(
        ERROR.CART.INSUFFICIENT_STOCK({ stock: sku.stock })
      );
    }

    const updatedCart = await populateCart(
      CartModel.findOneAndUpdate(
        {
          ...genFindCartQuery({ userId, guestCartId }),
          "items.product": productId,
          "items.sku": skuId,
        },
        {
          $set: {
            "items.$.quantity": quantity,
          },
        },
        {
          new: true,
        }
      )
    );

    return returnMutatedCart(updatedCart);
  }

  static async removeCartItem({ userId, productId, skuId, guestCartId }) {
    await validateCartItem({ productId, skuId });

    const updatedCart = await populateCart(
      CartModel.findOneAndUpdate(
        {
          ...genFindCartQuery({ userId, guestCartId }),
        },
        {
          $pull: {
            items: { product: productId, sku: skuId },
          },
        },
        {
          new: true,
        }
      )
    );

    return returnMutatedCart(updatedCart);
  }

  static async clearCart({ userId, guestCartId, res }) {
    const cart = await CartModel.findOneAndUpdate(
      genFindCartQuery({ userId, guestCartId }),
      { items: [] },
      { new: true }
    );

    if (guestCartId) clearCartCookie(res);
    if (!cart) {
      throw new ErrorResponse(ERROR.CART.INVALID_CART);
    }
    return returnMutatedCart(cart);
  }
}
