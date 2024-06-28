import ORDER from "../constants/order.constant.js";
import PAYMENT from "../constants/payment.constant.js";
import { BadRequestError } from "../core/error.response.js";
import OrderModel from "../models/order.model.js";
import { checkMissingFields } from "../utils/index.js";
import CartService from "./cart.service.js";
import PaymentService from "./payment.service.js";
import ProductService from "./product.service.js";
import ProductItemService from "./productItem.service.js";

export class OrderService {
  static async createOrder({
    paymentIntentId,
    userId,
    customerInfo,
    shippingAddress,
  }) {
    checkMissingFields({
      paymentIntentId,
      customerInfo,
      shippingAddress,
    });

    const { metadata } = await PaymentService.getPaymentIntent(paymentIntentId);
    const order = await OrderModel.create({
      userId,
      items: JSON.parse(metadata.items),
      price: JSON.parse(metadata.price),
      customerInfo,
      shippingAddress,
      paymentIntentId,
    });

    return { order };
  }

  static async authorizeOrder({ orderId, userId, guestCartId }) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new BadRequestError("Order is invalid");
    }

    const promises = order.items.map((orderItem) => {
      if (orderItem.itemId) {
        return ProductItemService.findProductItemById({
          itemId: orderItem.itemId,
        });
      } else {
        return ProductService.findProductById({
          productId: orderItem.productId,
        });
      }
    });

    const foundItems = await Promise.all(promises);

    try {
      for (let index = 0; index < foundItems.length; index++) {
        const item = foundItems[index];
        if (!item) {
          throw new BadRequestError(`There's an invalid item in your cart.`);
        }

        if (item.stock < order.items[index].quantity) {
          throw new BadRequestError(
            `An item is out of stock. Your order is canceled.`
          );
        }
      }
    } catch (error) {
      OrderModel.findByIdAndDelete(orderId);
      PaymentService.cancelPaymentIntent(order.paymentIntentId);
      throw error;
    }

    try {
      await CartService.clearCart({ userId, guestCartId });
    } catch (error) {}

    order.paymentStatus = PAYMENT.STATUS.ON_HOLD;
    order.orderStatus = ORDER.STATUS.PROCESSING;

    await order.save();
    return order;
  }
}
