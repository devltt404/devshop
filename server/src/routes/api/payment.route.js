import express from "express";
import PaymentController from "../../controllers/payment.controller.js";
import { isOptionallyAuthorized } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
const paymentRoutes = express.Router();

// USER + GUEST
paymentRoutes.post(
  "/payment-intent",
  isOptionallyAuthorized,
  asyncHandler(PaymentController.createPaymentIntent)
);

export default paymentRoutes;
