// import { BadRequestError } from "../core/error.response.js";
// import CartModel from "../models/cart.model.js";
// import ProductService from "./product.service.js";
// import ProductVariantService from "./productVariant.service.js";

// export default class CartService {
//   // #region VALIDATE

//   /**
//    * Validates and retrieves the product and variant by their IDs.
//    * @param {Object} params - Parameters object.
//    * @param {string} params.productId - ID of the product.
//    * @param {string} [params.variantId] - ID of the product variant.
//    * @returns {Promise<Object>} The found product and variant.
//    * @throws {BadRequestError} If the product or variant is not found or invalid.
//    */
//   static async getAndValidateItem({ productId, variantId }) {
//     const foundProduct = await ProductService.findProductById({
//       productId,
//       select: "stock variants",
//     });
//     if (!foundProduct) {
//       throw new BadRequestError("Product not found", {
//         errors: {
//           productId: "Product id is invalid",
//         },
//       });
//     }

//     if (foundProduct.variants.length > 0 && !variantId) {
//       throw new BadRequestError("Please choose the product variant", {
//         errors: {
//           variantId: "Variant id is required",
//         },
//       });
//     }

//     let foundVariant = null;
//     if (variantId) {
//       foundVariant = await ProductVariantService.findProductVariantById({
//         variantId,
//         select: "stock",
//       });

//       if (!foundProduct.variants.includes(variantId) || !foundVariant) {
//         throw new BadRequestError("Variant not found", {
//           errors: {
//             variantId: "Variant id is invalid",
//           },
//         });
//       }
//     }

//     return { foundProduct, foundVariant };
//   }

//   /**
//    * Validates the updated quantity of a cart item against available stock.
//    * @param {Object} params - Parameters object.
//    * @param {Object} params.foundProduct - The found product object.
//    * @param {Object} [params.foundVariant] - The found product variant object.
//    * @param {number} params.updatedQuantity - The quantity to validate.
//    * @throws {BadRequestError} If the updated quantity exceeds available stock.
//    */
//   static async validateUpdatedQuantity({
//     foundProduct,
//     foundVariant,
//     updatedQuantity,
//   }) {
//     const stock =
//       foundProduct.variants.length > 0
//         ? foundVariant.stock
//         : foundProduct.stock;

//     if (updatedQuantity > stock) {
//       throw new BadRequestError("Insufficient stock", {
//         errors: {
//           quantity: "Requested quantity exceeds stock limit",
//         },
//         code: "INSUFFICIENT_STOCK",
//       });
//     }
//   }

//   // #endregion VALIDATE

//   // #region HELPERS

//   /**
//    * Retrieves the cart ID from the request.
//    * @param {Object} req - The request object.
//    * @returns {string|null} The cart ID or null if not found.
//    */
//   static getCartId(req) {
//     return req.user ? req.user.cart : req.cookies.cartId;
//   }

//   /**
//    * Retrieves the cart object by its ID.
//    * @param {Object} params - Parameters object.
//    * @param {Object} params.req - The request object.
//    * @param {boolean} [params.lean=true] - Whether to return a lean object.
//    * @param {string} [params.populateFields=""] - Fields to populate in the cart.
//    * @param {string} [params.select="items"] - Fields to select in the cart.
//    * @param {string} [params.populateSelect=""] - Fields to select in the populated documents.
//    * @returns {Promise<Object>} The cart object and its ID.
//    */
//   static async getCartObject({
//     req,
//     lean = true,
//     populateFields = "",
//     select = "items",
//     populateSelect = "",
//   }) {
//     const cartId = this.getCartId(req);
//     if (!cartId) return { cart: null, cartId: null };

//     const cart = await CartModel.findById(cartId)
//       .select(select)
//       .lean(lean)
//       .populate(populateFields, populateSelect);
//     return { cart, cartId };
//   }

//   // #endregion HELPERS

//   // #region BUSINESS LOGIC

//   /**
//    * Retrieves the cart details for the current user or guest.
//    * @param {Object} req - The request object.
//    * @param {Object} res - The response object.
//    * @returns {Promise<Object>} The cart details.
//    */
//   static async getCartDetail(req, res) {
//     const { user } = req;
//     const { cart } = await this.getCartObject({
//       req,
//       populateFields: "items.product items.variant",
//       populateSelect: "name price originalPrice percentageDiscount",
//     });

//     if (!cart) {
//       if (user) {
//         user.cart = null;
//         await user.save({ validateBeforeSave: false });
//       } else {
//         res.clearCookie("cartId", { httpOnly: true });
//       }
//       return { items: [] };
//     }

//     return cart;
//   }

//   /**
//    * Adds a product to the cart.
//    * @param {Object} params - Parameters object.
//    * @param {string} params.productId - ID of the product to add.
//    * @param {string} [params.variantId] - ID of the product variant to add.
//    * @param {number} params.quantity - Quantity of the product to add.
//    * @param {Object} params.req - The request object.
//    * @param {Object} params.res - The response object.
//    * @returns {Promise<Object>} The updated cart items.
//    * @throws {BadRequestError} If the quantity is invalid or stock is insufficient.
//    */
//   static async addToCart({ productId, variantId, quantity, req, res }) {
//     if (!quantity || quantity < 1) {
//       throw new BadRequestError("Invalid quantity", {
//         errors: {
//           quantity: "Quantity must be greater than 0",
//         },
//       });
//     }

//     const { user } = req;
//     const { foundProduct, foundVariant } = await this.getAndValidateItem({
//       productId,
//       variantId,
//     });
//     let { cart } = await this.getCartObject({ req, lean: false });

//     if (!cart) {
//       if (user) {
//         cart = new CartModel({ user: user._id });
//         user.cart = cart._id;
//         await user.save({ validateBeforeSave: false });
//       } else {
//         cart = new CartModel({ user: null });
//         res.cookie("cartId", cart._id, { httpOnly: true });
//       }
//     }

//     const existingItem = cart.items.find(
//       (item) =>
//         item.product.toString() === productId &&
//         (!variantId || item.variant?.toString() === variantId)
//     );

//     const updatedQuantity = existingItem
//       ? existingItem.quantity + quantity
//       : quantity;
//     await this.validateUpdatedQuantity({
//       foundProduct,
//       foundVariant,
//       updatedQuantity,
//     });

//     if (existingItem) {
//       existingItem.quantity = updatedQuantity;
//     } else {
//       cart.items.push({ product: productId, variant: variantId, quantity });
//     }

//     await cart.save();
//     return { items: cart.items };
//   }

//   /**
//    * Updates the quantity of an item in the cart.
//    * @param {Object} params - Parameters object.
//    * @param {string} params.productId - ID of the product to update.
//    * @param {string} [params.variantId] - ID of the product variant to update.
//    * @param {number} params.quantity - New quantity of the product.
//    * @param {Object} params.req - The request object.
//    * @returns {Promise<Object>} The updated cart.
//    */
//   static async updateCartItem({ productId, variantId, quantity, req }) {
//     //Validate item
//     const { foundProduct, foundVariant } = await this.getAndValidateItem({
//       productId,
//       variantId,
//     });

//     //Validate quantity
//     if (!quantity || quantity < 1) {
//       throw new BadRequestError("Invalid quantity", {
//         errors: {
//           quantity: "Quantity must be greater than 0",
//         },
//       });
//     }
//     await this.validateUpdatedQuantity({
//       foundProduct,
//       foundVariant,
//       updatedQuantity: quantity,
//     });

//     const query = { _id: this.getCartId(req), "items.product": productId };
//     if (variantId) query["items.variant"] = variantId;

//     const update = { $set: { "items.$.quantity": quantity } };
//     const options = { new: true };

//     const updatedCart = await CartModel.findOneAndUpdate(query, update, options)
//       .select("items")
//       .lean();

//     return updatedCart;
//   }

//   /**
//    * Removes an item from the cart.
//    * @param {Object} params - Parameters object.
//    * @param {string} params.productId - ID of the product to remove.
//    * @param {string} [params.variantId] - ID of the product variant to remove.
//    * @param {Object} params.req - The request object.
//    * @returns {Promise<Object>} The updated cart.
//    */
//   static async removeCartItem({ productId, variantId, req }) {
//     const cartId = this.getCartId(req);

//     const updatedCart = await CartModel.findByIdAndUpdate(
//       cartId,
//       { $pull: { items: { product: productId, variant: variantId } } },
//       { new: true }
//     )
//       .select("items")
//       .lean();

//     return updatedCart;
//   }

//   /**
//    * Clears all items from the cart.
//    * @param {Object} req - The request object.
//    * @returns {Promise<Object>} The cleared cart.
//    */
//   static async clearCart(req) {
//     const cartId = this.getCartId(req);
//     const clearedCart = await CartModel.findByIdAndUpdate(
//       cartId,
//       { items: [] },
//       { new: true }
//     )
//       .select("items")
//       .lean();

//     return clearedCart;
//   }
//   // #endregion BUSINESS LOGIC
// }
