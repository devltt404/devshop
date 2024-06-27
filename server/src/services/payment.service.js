import Stripe from "stripe";
import serverConfig from "../configs/server.config.js";
import ERROR from "../constants/error.constant.js";
import PRODUCT from "../constants/product.constant.js";
import { ErrorResponse } from "../core/error.response.js";
import CartService from "./cart.service.js";
const stripe = Stripe(serverConfig.stripe.sk);

export default class PaymentService {
  static async createCheckoutSession({ userId, guestCartId, res }) {
    const cart = await CartService.getCartDetail({
      userId,
      guestCartId,
      lean: false,
    });

    if (!cart.items?.length) {
      throw new ErrorResponse(ERROR.PAYMENT.EMPTY_CART.code);
    }

    let isExceedsStock = false;

    const line_items = cart.items.map((cartItem) => {
      if (cartItem.quantity > cartItem.stock) {
        isExceedsStock = true;
        cartItem.quantity = cartItem.stock;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name:
              cartItem.type === PRODUCT.TYPE.CONFIGURABLE
                ? cartItem.name +
                  " | " +
                  Array.from(cartItem.variationSelection.values()).join(" - ")
                : cartItem.name,
            images: [cartItem.image],
          },
          unit_amount: parseInt(cartItem.price * 100),
        },
        quantity: cartItem.quantity,
      };
    });

    if (isExceedsStock) {
      await cart.save();
      throw new ErrorResponse(ERROR.PAYMENT.INSUFFICIENT_STOCK.code);
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${serverConfig.server.apiBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${serverConfig.client.baseUrl + "/cart"}`,
    });

    return session.url;
  }
}
