import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import ProductModel from "../models/product.model.js";
import CategoryService from "./category.service.js";
import SkuService from "./sku.service.js";

export default class ProductService {
  // #region QUERY
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
    const product = await ProductModel.findById(productId)
      .populate("category")
      .lean();
    if (!product) {
      throw new ErrorResponse(ERROR.PRODUCT.NOT_FOUND);
    }

    const [skus, category] = await Promise.all([
      SkuService.findSkusByProductId({ productId }),
      CategoryService.getTreeOfSingleCategory(product.category),
    ]);

    product.skus = skus;
    product.category = category;

    product.minPrice = Math.min(...skus.map((sku) => sku.price));
    product.maxPrice = Math.max(...skus.map((sku) => sku.price));

    return { product };
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

    // Aggregation pipeline
    const pipeline = [];

    // Object to filter products
    const matchConditions = {};

    if (key) {
      matchConditions.$text = { $search: key };
    }

    if (minRating) {
      matchConditions.avgRating = { $gte: minRating };
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

      matchConditions.category = { $in: [...descendantIds, categoryId] };
    }

    if (Object.keys(matchConditions).length !== 0) {
      pipeline.push({
        $match: matchConditions,
      });
    }

    // Lookup SKUs to get the minimum and maximum prices for each product
    pipeline.push({
      $lookup: {
        from: "skus", // The collection name for SKUs
        localField: "_id",
        foreignField: "productId",
        as: "skus",
      },
    });

    pipeline.push({
      $addFields: {
        minPrice: {
          $min: "$skus.price",
        },
        maxPrice: {
          $max: "$skus.price",
        },
      },
    });

    pipeline.push({
      $addFields: {
        defaultSku: {
          $arrayElemAt: [
            {
              $filter: {
                input: {
                  $map: {
                    input: "$skus",
                    as: "sku",
                    in: {
                      _id: "$$sku._id",
                      image: {
                        $cond: {
                          if: { $gt: [{ $size: "$$sku.images" }, 0] },
                          then: { $arrayElemAt: ["$$sku.images", 0] },
                          else: { $arrayElemAt: ["$images", 0] },
                        },
                      },
                      price: "$$sku.price",
                      originalPrice: "$$sku.originalPrice",
                    },
                  },
                },
                as: "sku",
                cond: { $eq: ["$$sku.price", "$minPrice"] },
              },
            },
            0,
          ],
        },
      },
    });

    // Filter products by price range
    if (minPrice || maxPrice) {
      pipeline.push({
        $match: {
          $expr: {
            $and: [
              { $gte: ["$minPrice", minPrice || 0] },
              { $lte: ["$maxPrice", maxPrice || Infinity] },
            ],
          },
        },
      });
    }

    // Exclude some detail fields to reduce the response size
    pipeline.push({
      $project: {
        features: 0,
        details: 0,
        skus: 0,
        variations: 0,
        description: 0,
        images: 0,
      },
    });

    // Sort
    if (sortBy === "priceAsc") {
      pipeline.push({
        $sort: { minPrice: 1 },
      });
    } else if (sortBy === "priceDesc") {
      pipeline.push({
        $sort: { minPrice: -1 },
      });
    } else if (sortBy === "ctimeDesc") {
      pipeline.push({
        $sort: { createdAt: -1 },
      });
    } else if (sortBy === "soldDesc") {
      pipeline.push({
        $sort: { numSold: -1 },
      });
    }

    // Pagination
    pipeline.push({
      $facet: {
        pagination: [{ $count: "totalProducts" }],
        products: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    });

    // Flatten the pagination array to an object
    pipeline.push({
      $addFields: {
        pagination: { $arrayElemAt: ["$pagination", 0] },
      },
    });

    const res = (await ProductModel.aggregate(pipeline))[0];

    // Add some more pagination info
    if (!res.pagination) {
      res.pagination = { totalProducts: 0 };
    }
    res.pagination.page = page;
    res.pagination.limit = limit;
    res.pagination.totalPages = Math.ceil(res.pagination.totalProducts / limit);

    return res;
  }
}
