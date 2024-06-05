// import express from "express";
// import CartController from "../../controllers/cart.controller.js";
// import { isOptionalAuthorized } from "../../middlewares/auth.middleware.js";
// import { asyncHandler } from "../../utils/index.js";
// const cartRoutes = express.Router();

// //! USER + GUEST
// cartRoutes.get(
//   "/detail",
//   isOptionalAuthorized,
//   asyncHandler(CartController.getCartDetail)
// );
// cartRoutes.put(
//   "/item",
//   isOptionalAuthorized,
//   asyncHandler(CartController.addToCart)
// );
// cartRoutes.patch("/item", asyncHandler(CartController.updateCartItem));
// cartRoutes.delete("/item", asyncHandler(CartController.removeCartItem));
// cartRoutes.delete(
//   "/all",
//   isOptionalAuthorized,
//   asyncHandler(CartController.clearCart)
// );

// export default cartRoutes;
