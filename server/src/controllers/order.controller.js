import { SuccessResponse } from "../core/response.js";
import { OrderService } from "../services/order.service.js";
import { getCommonCartParams } from "../utils/cart.util.js";

export default class OrderController {
  static async getOrder(req, res) {
    return new SuccessResponse({
      message: "Order fetched successfully",
      metadata: await OrderService.getOrder({
        orderId: req.params.orderId,
      }),
    }).send(res);
  }

  static async getOrders(req, res) {
    return new SuccessResponse({
      message: "User orders fetched successfully",
      metadata: await OrderService.getUserOrders({
        userId: req.user?._id,
      }),
    }).send(res);
  }

  static async createOrder(req, res) {
    return new SuccessResponse({
      status: 201,
      message: "Order created successfully",
      metadata: await OrderService.createOrder({
        userId: req.user?._id,
        ...req.body,
      }),
    }).send(res);
  }

  static async authorizeOrder(req, res) {
    return new SuccessResponse({
      message: "Order confirmed successfully",
      metadata: {
        order: await OrderService.authorizeOrder({
          ...getCommonCartParams(req),
          orderId: req.params.orderId,
          paymentId: req.body.paymentId,
        }),
      },
    }).send(res);
  }
}
