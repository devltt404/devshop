// import { SuccessResponse } from "../core/success.response.js";
// import CartService from "../services/cart.service.js";

// export default class CartController {
//   static async getCartDetail(req, res) {
//     return new SuccessResponse({
//       message: "Cart details fetched successfully",
//       metadata: {
//         cart: await CartService.getCartDetail(req, res),
//       },
//     }).send(res);
//   }

//   static async addToCart(req, res) {
//     return new SuccessResponse({
//       message: "Product added to cart successfully",
//       metadata: {
//         cart: await CartService.addToCart({
//           productId: req.body.productId,
//           variantId: req.body.variantId,
//           quantity: req.body.quantity,
//           guestCart: req.guestCart,
//           req,
//           res,
//         }),
//       },
//     }).send(res);
//   }

//   static async updateCartItem(req, res) {
//     return new SuccessResponse({
//       message: "Cart item updated successfully",
//       metadata: {
//         cart: await CartService.updateCartItem({
//           productId: req.body.productId,
//           variantId: req.body.variantId,
//           quantity: req.body.quantity,
//           req,
//           res,
//         }),
//       },
//     }).send(res);
//   }

//   static async removeCartItem(req, res) {
//     return new SuccessResponse({
//       message: "Cart item removed successfully",
//       metadata: {
//         cart: await CartService.removeCartItem({
//           productId: req.body.productId,
//           variantId: req.body.variantId,
//           req,
//           res,
//         }),
//       },
//     }).send(res);
//   }

//   static async clearCart(req, res) {
//     return new SuccessResponse({
//       message: "Cart cleared successfully",
//       metadata: {
//         cart: await CartService.clearCart(req),
//       },
//     }).send(res);
//   }
// }
