import express from "express";
import OrderController from "../../controllers/order.controller.js";
import {
  isAuthorized,
  isOptionallyAuthorized,
} from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
const orderRoutes = express.Router();

//USER
orderRoutes.get("/user", isAuthorized, asyncHandler(OrderController.getOrders));

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
orderRoutes.get("/:orderId", asyncHandler(OrderController.getOrder));

export default orderRoutes;
