// import ProductVariantModel from "../models/productVariant.model.js";

// export default class ProductVariantService {
//   //#region QUERY

//   /**
//    * Finds a product variant by its ID.
//    *
//    * @param {Object} options - The options for finding the product variant.
//    * @param {string} options.variantId - The ID of the product variant to find.
//    * @param {string} [options.select=""] - The fields to include or exclude in the result.
//    * @param {string} [options.populateFields=""] - The fields to populate in the result.
//    * @param {boolean} [options.lean=true] - Whether to return a plain JavaScript object (lean) instead of a Mongoose document.
//    * @returns {Promise<Object|null>} - A promise that resolves to the found product variant or null if not found.
//    * @throws {Error} - Throws an error if the query fails.
//    */
//   static async findProductVariantById({
//     variantId,
//     select = "",
//     populateFields = "",
//     lean = true,
//   }) {
//     return await ProductVariantModel.findById(variantId)
//       .select(select)
//       .populate(populateFields)
//       .lean(lean);
//   }

//   static async updateProductVariant(variantId, updateData) {
//     return await ProductVariantModel.findByIdAndUpdate(variantId, updateData, {
//       new: true,
//       runValidators: true,
//     }).lean();
//   }
//   //#endregion QUERY

//   // #region BUSINESS LOGIC

//   /**
//    * Creates product variants in the database.
//    *
//    * @param {Array} variants - An array of product variants data.
//    * @param {Object} session - The mongo database session to use for the operation.
//    * @returns {Array} - An array of the created product variant IDs.
//    */
//   static async createProductVariants(variants, session) {
//     const createdVariants = await ProductVariantModel.create(variants, {
//       session,
//     });
//     return createdVariants.map((variant) => variant._id);
//   }
  
//   // #endregion BUSINESS LOGIC
// }
