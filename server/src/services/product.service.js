import { BadRequestError, NotFoundError } from "../core/error.response.js";
import ProductModel from "../models/product.model.js";
import ProductItemModel from "../models/productItem.model.js";
import ProductVariationGroupModel from "../models/productVariationGroup.model.js";
import CategoryService from "./category.service.js";

ProductItemModel;
ProductVariationGroupModel;
export default class ProductService {
  // #region QUERY
  /**
   * Finds product with pagination.
   *
   * @param {Object} options - The options for pagination.
   * @param {Object} options.filter - The filter object for querying product.
   * @param {Object} options.projection - The projection object for selecting fields.
   * @param {Object} [options.sortBy={ createdAt: -1 }] - The sort object for sorting product.
   * @param {number} [options.page=1] - The page number for pagination.
   * @param {number} [options.limit=10] - The maximum number of product per page.
   * @param {boolean} [options.lean=true] - Whether to return plain JavaScript objects instead of Mongoose documents.
   * @param {string} [options.select="_id name price originalPrice percentageDiscount avgRating images category numSold"] - The fields to select for each product.
   * @returns {Object} - The paginated result containing the pagination information and the product.
   */
  static async findProductsWithPagination({
    filter,
    projection,
    sortBy = { createdAt: -1 },
    page = 1,
    limit = 10,
    lean = true,
    select = "-description -details",
    populate = "defaultItemId",
    populateFields = "_id productId price originalPrice discountPercent",
  }) {
    const skip = (page - 1) * limit;
    const products = await ProductModel.find(filter, projection)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
      .select(select)
      .populate(populate, populateFields)
      .lean(lean);

    const totalPages = Math.floor(
      (await ProductModel.countDocuments(filter)) / limit
    );

    // Extract the first 2 images of each product
    products.forEach((product) => {
      product.images = product.images.slice(0, 2);
    });

    return {
      pagination: {
        totalPages,
        page,
        limit,
      },
      products,
    };
  }

  static async findProductById({
    productId,
    select = "",
    populate,
    populateFields,
    lean = true,
  }) {
    return await ProductModel.findById(productId)
      .select(select)
      .populate(populate, populateFields)
      .lean(lean);
  }
  // #endregion QUERY

  // #region BUSINESS LOGIC

  /**
   * Retrieves the detailed information of a product by its ID.
   *
   * @param {string} productId - The ID of the product to retrieve.
   * @returns {Promise<Object>} The detailed information of the product.
   * @throws {NotFoundError} If the product with the given ID is not found.
   */
  static async getProductDetailById(productId) {
    const [product, items] = await Promise.all([
      ProductModel.findById(productId)
        .lean()
        .populate("variationGroupId")
        .populate("categoryId", "name slug path"),

      ProductItemModel.find({
        productId,
      }).lean(),
    ]);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    product.categoryId = await CategoryService.getTreeOfSingleCategory(
      product.categoryId
    );
    product.items = items;
    return product;
  }

  /**
   * Retrieves product based on the provided filters and pagination options.
   *
   * @param {Object} options - The options for filtering and pagination.
   * @param {string} options.key - The search keyword.
   * @param {number} [options.page=1] - The page number.
   * @param {number} [options.limit=10] - The maximum number of product per page.
   * @param {string} options.sortBy - The sorting option for the product.
   * @param {string} options.categoryId - The ID of the category to filter by.
   * @param {number} options.minRating - The minimum rating for the product.
   * @param {number} options.minPrice - The minimum price for the product.
   * @param {number} options.maxPrice - The maximum price for the product.
   * @returns {Promise<Array>} The array of product that match the provided filters and pagination options.
   * @throws {BadRequestError} If the specified category is not found.
   */
  static async getProducts({
    key,
    page = 1,
    limit = 10,
    sortBy,
    categoryId,
    minRating,
    minPrice,
    maxPrice,
  }) {
    // Parse the query number parameters
    limit = parseInt(limit);
    page = parseInt(page);

    const filter = {};
    const projection = {};
    const sort = {};

    if (key) {
      filter.$text = { $search: key };
      projection.score = { $meta: "textScore" };
      sort.score = { $meta: "textScore" };
    }

    if (minRating) {
      filter.avgRating = { $gte: minRating };
    }

    if (minPrice) {
      filter.minPrice = { $gte: minPrice };
    }

    if (maxPrice) {
      filter.maxPrice = { $lte: maxPrice };
    }

    if (categoryId) {
      const foundCategory = await CategoryService.findOneCategory({
        filter: { _id: categoryId },
      });

      if (!foundCategory) {
        throw new BadRequestError("Category not found", {
          errors: { categoryId: "Category not found" },
        });
      }

      const descendantIds = await CategoryService.getDescendantIds(
        foundCategory._id
      );
      filter.categoryId = { $in: descendantIds };
    }

    if (sortBy === "priceAsc") {
      sort.price = 1;
    } else if (sortBy === "priceDesc") {
      sort.price = -1;
    } else if (sortBy === "ctimeDesc") {
      sort.createdAt = -1;
    } else if (sortBy === "soldDesc") {
      sort.numSold = -1;
    }

    return await this.findProductsWithPagination({
      filter,
      projection,
      sortBy: sort,
      page,
      limit,
    });
  }

  // //TODO: Fixing the createProduct method
  // /**
  //  * Creates a new product.
  //  *
  //  * @param {Object} productData - The data for the new product.
  //  * @returns {Promise<Object>} The created product object.
  //  * @throws {BadRequestError} If the product name already exists or there are invalid fields.
  //  */
  // static async createProduct({
  //   name,
  //   description,
  //   price,
  //   discountedPrice,
  //   details,
  //   stock,
  //   category,
  //   variants,
  //   images,
  // }) {
  //   //Check if product name already exists
  //   const existedProduct = await ProductModel.findOne({
  //     $or: [{ name }, { slug: slugify(name, { lower: true }) }],
  //   }).lean();

  //   if (existedProduct) {
  //     throw new BadRequestError("Product already exists", {
  //       errors: {
  //         name: "Product name already exists",
  //       },
  //     });
  //   }

  //   // Start a mongoose session
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   try {
  //     // Create variants if they exist
  //     let variantIds = [];
  //     if (variants) {
  //       variantIds = await ProductVariantService.createProductVariants(
  //         variants,
  //         session
  //       );
  //     }

  //     //Create the product
  //     const newProduct = await ProductModel.create(
  //       [
  //         {
  //           name,
  //           description,
  //           price,
  //           discountedPrice,
  //           details,
  //           stock,
  //           category,
  //           variants: variantIds,
  //           images,
  //         },
  //       ],
  //       { session }
  //     );

  //     //End the mongoose session
  //     await session.commitTransaction();
  //     session.endSession();
  //     return newProduct;
  //   } catch (error) {
  //     //Abort the transaction if an error occurs
  //     await session.abortTransaction();
  //     session.endSession();
  //     throw error;
  //   }
  // }

  // /**
  //  * Updates a product and its variants.
  //  *
  //  * @param {string} productId - The ID of the product to update.
  //  * @param {Object} updateData - The data to update the product with.
  //  * @returns {Promise<Object>} - The updated product.
  //  * @throws {NotFoundError} - If the product is not found.
  //  */
  // static async updateProduct(productId, updateData) {
  //   const variantData = updateData.variants;
  //   delete updateData.variants;

  //   // Update the product
  //   const updatedProduct = await ProductModel.findByIdAndUpdate(
  //     productId,
  //     updateData,
  //     { new: true, runValidators: true }
  //   );
  //   if (!updatedProduct) {
  //     throw new NotFoundError("Product not found");
  //   }

  //   // Update the product variants
  //   if (variantData) {
  //     const updateVariantPromises = [];
  //     variantData.forEach((variantUpdateData) => {
  //       const variantId = variantUpdateData._id;
  //       delete variantUpdateData._id;

  //       updateVariantPromises.push(
  //         ProductVariantService.updateProductVariant(
  //           variantId,
  //           variantUpdateData
  //         )
  //       );
  //     });
  //     await Promise.all(updateVariantPromises);
  //   }

  //   await updatedProduct.populate("variants");

  //   return updatedProduct;
  // }
  // #endregion BUSINESS LOGIC
}
