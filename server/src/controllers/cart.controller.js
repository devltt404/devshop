import { SuccessResponse } from "../core/response.js";
import CartService from "../services/cart.service.js";
import { getCommonCartParams } from "../utils/cart.util.js";

export default class CartController {
  static async getSimpleCart(req, res) {
    return new SuccessResponse({
      message: "Simple cart fetched successfully",
      metadata: {
        cart: await CartService.getSimpleCart({
          ...getCommonCartParams(req),
          res,
        }),
      },
    }).send(res);
  }

  static async getCartDetail(req, res) {
    return new SuccessResponse({
      message: "Cart details fetched successfully",
      metadata: {
        cart: await CartService.getCartDetail({
          ...getCommonCartParams(req),
        }),
      },
    }).send(res);
  }

  static async addToCart(req, res) {
    return new SuccessResponse({
      message: "Product added to cart successfully",
      metadata: {
        cart: await CartService.addToCart({
          ...getCommonCartParams(req),
          ...req.body,
          res,
        }),
      },
    }).send(res);
  }

  static async updateCartItemQuantity(req, res) {
    return new SuccessResponse({
      message: "Cart item quantity updated successfully",
      metadata: {
        cart: await CartService.updateCartItemQuantity({
          ...req.body,
          ...getCommonCartParams(req),
        }),
      },
    }).send(res);
  }

  static async removeCartItem(req, res) {
    return new SuccessResponse({
      message: "Cart item deleted successfully",
      metadata: {
        cart: await CartService.removeCartItem({
          ...req.body,
          ...getCommonCartParams(req),
          res,
        }),
      },
    }).send(res);
  }

  static async clearCart(req, res) {
    return new SuccessResponse({
      message: "Cart cleared successfully",
      metadata: {
        cart: await CartService.clearCart({
          ...getCommonCartParams(req),
          res,
        }),
      },
    }).send(res);
  }
}
