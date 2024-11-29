import express from "express";
import CartController from "../../controllers/cart.controller.js";
import { isOptionallyAuthorized } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
const cartRoutes = express.Router();

//! USER + GUEST
cartRoutes.use(isOptionallyAuthorized);
cartRoutes.get("/simple", asyncHandler(CartController.getSimpleCart));
cartRoutes.get("/detail", asyncHandler(CartController.getCartDetail));
cartRoutes.post("/item", asyncHandler(CartController.addToCart));
cartRoutes.delete("/item", asyncHandler(CartController.removeCartItem));
cartRoutes.put(
  "/item-quantity",
  asyncHandler(CartController.updateCartItemQuantity)
);
cartRoutes.delete("/all-items", asyncHandler(CartController.clearCart));

export default cartRoutes;
