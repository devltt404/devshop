import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import ProductModel from "../models/product.model.js";
import ProductItemModel from "../models/productItem.model.js";
import ProductVariationGroupModel from "../models/productVariationGroup.model.js";
import CategoryService from "./category.service.js";

ProductItemModel;
ProductVariationGroupModel;
export default class ProductService {
  // #region QUERY
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

    const totalPages = Math.ceil(
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

  static async findProductByIdAndUpdate({ productId, update }) {
    return await ProductModel.findByIdAndUpdate(productId, update, {
      new: true,
    }).lean();
  }
  // #endregion

  // #region BUSINESS LOGIC
  static async getProductDetail(productId) {
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
      throw new ErrorResponse(ERROR.PRODUCT.PRODUCT_NOT_FOUND);
    }

    product.categoryId = await CategoryService.getTreeOfSingleCategory(
      product.categoryId
    );
    product.items = items;
    return product;
  }

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
        throw new ErrorResponse(ERROR.PRODUCT.INVALID_CATEGORY);
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
}
