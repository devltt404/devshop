import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import ProductModel from "../models/product.model.js";
import CategoryService from "./category.service.js";
import { ElasticsearchService } from "./elasticsearch.service.js";
import SkuService from "./sku.service.js";

export default class ProductService {
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

  static async aggregateProductsBasicInfo(productIds) {
    return await ProductModel.aggregate([
      {
        $match: {
          _id: { $in: productIds },
        },
      },
      {
        $lookup: {
          from: "skus",
          localField: "_id",
          foreignField: "productId",
          as: "skus",
        },
      },
      {
        $addFields: {
          minPrice: {
            $min: "$skus.price",
          },
          maxPrice: {
            $max: "$skus.price",
          },
        },
      },
      {
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
      },
      {
        $project: {
          features: 0,
          details: 0,
          skus: 0,
          variations: 0,
          description: 0,
          images: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
  }

  static async getProducts(params) {
    const { productIds, totalProducts, facets } =
      await ElasticsearchService.searchProducts(params);

    let aggregatedProducts;
    if (params.facet === "category") {
      [aggregatedProducts, facets.category.buckets] = await Promise.all([
        this.aggregateProductsBasicInfo(productIds),
        CategoryService.aggregateFacetCategories(facets.category.buckets),
      ]);
    } else {
      aggregatedProducts = await this.aggregateProductsBasicInfo(productIds);
    }

    return {
      products: aggregatedProducts,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(totalProducts / params.limit),
      },
      facets,
    };
  }
}
