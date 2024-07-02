import { SuccessResponse } from "../core/response.js";
import PaymentService from "../services/payment.service.js";
import { getCommonCartParams } from "../utils/cart.util.js";

export default class PaymentController {
  static async createPaymentIntent(req, res) {
    return new SuccessResponse({
      message: "Create payment intent successfully",
      metadata: await PaymentService.createPaymentIntent({
        ...getCommonCartParams(req),
      }),
    }).send(res);
  }
}
