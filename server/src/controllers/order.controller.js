import { SuccessResponse } from "../core/success.response.js";
import { OrderService } from "../services/order.service.js";
import { getCommonCartParams } from "../utils/cart.util.js";

export default class OrderController {
  static async createOrder(req, res) {
    return new SuccessResponse({
      status: 201,
      message: "Order created successfully",
      metadata: await OrderService.createOrder({
        userId: req.user._id,
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
