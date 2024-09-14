import Stripe from "stripe";
import serverConfig from "../configs/server.config.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import CartService from "./cart.service.js";
const stripe = Stripe(serverConfig.stripe.sk);

export default class PaymentService {
  // #region BUSINESS LOGIC
  static async getPaymentIntent(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  }

  static async getPaymentMethod(paymentMethodId) {
    return await stripe.paymentMethods.retrieve(paymentMethodId);
  }

  static async createPaymentIntent({ userId, guestCartId }) {
    const { cart } = await CartService.getCartDetail({
      userId,
      guestCartId,
    });

    if (!cart.items?.length) {
      throw new ErrorResponse(ERROR.PAYMENT.EMPTY_CART);
    }
    // Format order items and price
    const price = {
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.total,
      currency: "usd",
      capture_method: "manual",
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderData: {
        items: cart.items,
        price,
      },
    };
  }

  static async cancelPaymentIntent(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  }
  // #endregion
}
