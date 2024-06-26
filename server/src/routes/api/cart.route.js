import express from "express";
import CartController from "../../controllers/cart.controller.js";
import { isOptionallyAuthorized } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
const cartRoutes = express.Router();

//! USER + GUEST
cartRoutes.get(
  "/simple",
  isOptionallyAuthorized,
  asyncHandler(CartController.getSimpleCart)
);
cartRoutes.get(
  "/detail",
  isOptionallyAuthorized,
  asyncHandler(CartController.getCartDetail)
);
cartRoutes.post(
  "/item",
  isOptionallyAuthorized,
  asyncHandler(CartController.addToCart)
);
cartRoutes.delete("/item", asyncHandler(CartController.removeCartItem));
cartRoutes.put("/item-quantity", asyncHandler(CartController.updateCartItemQuantity));
cartRoutes.delete(
  "/all-items",
  isOptionallyAuthorized,
  asyncHandler(CartController.clearCart)
);

export default cartRoutes;
