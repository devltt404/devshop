import { ORDER } from "../constants/index.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import OrderModel from "../models/order.model.js";
import { checkMissingFields } from "../utils/helper.util.js";
import CartService from "./cart.service.js";
import PaymentService from "./payment.service.js";
import ProductService from "./product.service.js";
import SkuService from "./sku.service.js";

export class OrderService {
  // #region BUSINESS LOGIC
  static async getOrderDetail({ orderId }) {
    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      throw new ErrorResponse(ERROR.ORDER.ORDER_NOT_FOUND);
    }

    const { payment_method } = await PaymentService.getPaymentIntent(
      order.paymentIntentId
    );
    const paymentMethod = await PaymentService.getPaymentMethod(payment_method);
    order.paymentMethod = {
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
    };

    return { order };
  }

  static async getUserOrders({ userId }) {
    return {
      orders: await OrderModel.find({ userId })
        .lean()
        .select("-paymentIntentId"),
    };
  }

  static async createOrder({
    paymentIntentId,
    userId,
    customerInfo,
    shippingAddress,
    orderData,
  }) {
    checkMissingFields({
      paymentIntentId,
      customerInfo,
      shippingAddress,
    });

    const order = await OrderModel.create({
      userId,
      items: orderData.items,
      price: orderData.price,
      customerInfo,
      shippingAddress,
      paymentIntentId,
    });

    return { order };
  }

  static async authorizeOrder({ orderId, userId, guestCartId }) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new ErrorResponse(ERROR.ORDER.INVALID_ORDER);
    }

    try {
      // Check if all items in the order are valid and in stock
      const queryPromises = [];
      order.items.map((orderItem) => {
        queryPromises.push(
          ProductService.findProductById({
            productId: orderItem.product,
            lean: false,
          }),
          SkuService.findSkuById({
            skuId: orderItem.sku,
            lean: false,
          })
        );
      });

      const productsAndSkus = await Promise.all(queryPromises);
      for (let i = 0; i < productsAndSkus.length; i += 2) {
        const item = order.items[i];
        const product = productsAndSkus[i];
        const sku = productsAndSkus[i + 1];

        if (!product || !sku) {
          throw new ErrorResponse(ERROR.ORDER.INVALID_ORDER_ITEM);
        }

        if (sku.stock < item.quantity) {
          throw new ErrorResponse(ERROR.ORDER.INSUFFICIENT_STOCK);
        } else {
          item.stock -= item.quantity;
          product.numSold += item.quantity;
        }
      }

      // Save the updated stock and numSold
      const updatePromises = productsAndSkus.map((item) => item.save());
      await Promise.all(updatePromises);

      try {
        await CartService.clearCart({ userId, guestCartId });
      } catch (error) {}

      // Update order status
      order.orderStatus = ORDER.STATUS.PROCESSING;
      await order.save();

      return order;
    } catch (error) {
      await Promise.all([
        OrderModel.findByIdAndDelete(orderId),
        PaymentService.cancelPaymentIntent(order.paymentIntentId),
      ]);

      throw error;
    }
  }
  // #endregion
}
