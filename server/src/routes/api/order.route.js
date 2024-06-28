import express from "express";
import OrderController from "../../controllers/order.controller.js";
import { isOptionallyAuthorized } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
const orderRoutes = express.Router();

// USER + GUEST
orderRoutes.post(
  "/",
  isOptionallyAuthorized,
  asyncHandler(OrderController.createOrder)
);
orderRoutes.post(
  "/authorize/:orderId",
  isOptionallyAuthorized,
  asyncHandler(OrderController.authorizeOrder)
);

export default orderRoutes;
