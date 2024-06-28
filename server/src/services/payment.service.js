import Stripe from "stripe";
import serverConfig from "../configs/server.config.js";
import ERROR from "../constants/error.constant.js";
import { ErrorResponse } from "../core/error.response.js";
import CartService from "./cart.service.js";
const stripe = Stripe(serverConfig.stripe.sk);

export default class PaymentService {
  static async getPaymentIntent(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  }

  static async createPaymentIntent({ userId, guestCartId }) {
    const cart = await CartService.getCartDetail({
      userId,
      guestCartId,
    });

    if (!cart.items?.length) {
      throw new ErrorResponse(ERROR.PAYMENT.EMPTY_CART);
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      itemId: item.itemId,
      name: item.name,
      image: item.image,
      variation: item.variationSelection
        ? Array.from(item.variationSelection.values()).join(" - ")
        : undefined,
      quantity: item.quantity,
      price: item.price,
    }));

    const price = {
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.total,
      currency: "usd",
      capture_method: "manual",
      metadata: {
        items: JSON.stringify(orderItems),
        price: JSON.stringify(price),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      cart,
      paymentIntentId: paymentIntent.id,
    };
  }

  static async cancelPaymentIntent(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  }
}
