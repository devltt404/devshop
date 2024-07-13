import {ORDER} from "../constants/index.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import OrderModel from "../models/order.model.js";
import { checkMissingFields } from "../utils/helper.util.js";
import CartService from "./cart.service.js";
import PaymentService from "./payment.service.js";
import ProductService from "./product.service.js";
import ProductItemService from "./productItem.service.js";

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
      const promises = order.items.map((orderItem) => {
        if (orderItem.itemId) {
          return ProductItemService.findProductItemById({
            itemId: orderItem.itemId,
            lean: false,
          });
        } else {
          return ProductService.findProductById({
            productId: orderItem.productId,
            lean: false,
          });
        }
      });

      // Object to store the number of sold items of product with sold items
      const productsNeedToBeUpdated = {};

      const orderItems = await Promise.all(promises);
      for (let index = 0; index < orderItems.length; index++) {
        const item = orderItems[index];
        if (!item) {
          throw new ErrorResponse(ERROR.ORDER.INVALID_ORDER_ITEM);
        }

        if (item.stock < order.items[index].quantity) {
          throw new ErrorResponse(ERROR.ORDER.INSUFFICIENT_STOCK);
        } else {
          item.stock -= order.items[index].quantity;

          // If the item is a simple product, update the number of sold items directly
          if (!order.items[index].itemId) {
            item.numSold += order.items[index].quantity;
          }
          // If the item is  item of a configurable product, update the number of sold items of the main product
          else {
            if (!productsNeedToBeUpdated[item.productId]) {
              productsNeedToBeUpdated[item.productId] = 0;
            }
            productsNeedToBeUpdated[item.productId] +=
              order.items[index].quantity;
          }
        }
      }

      // Save the updated stock and numSold
      orderItems.forEach(async (item) => {
        item.save();
      });

      for (const productId in productsNeedToBeUpdated) {
        ProductService.findProductByIdAndUpdate({
          productId,
          update: { $inc: { numSold: productsNeedToBeUpdated[productId] } },
        });
      }

      // Clear cart
      try {
        await CartService.clearCart({ userId, guestCartId });
      } catch (error) {}

      // Update order status
      order.orderStatus = ORDER.STATUS.PROCESSING;
      await order.save();

      return order;
    } catch (error) {
      OrderModel.findByIdAndDelete(orderId);
      PaymentService.cancelPaymentIntent(order.paymentIntentId);
      throw error;
    }
  }
  // #endregion
}
