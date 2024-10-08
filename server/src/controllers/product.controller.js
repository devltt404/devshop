import mongoose from "mongoose";
import ERROR from "../core/error.response.js";
import { ErrorResponse, SuccessResponse } from "../core/response.js";
import ProductService from "../services/product.service.js";

export default class ProductController {
  static async getProducts(req, res) {
    return new SuccessResponse({
      message: "Products retrieved successfully",
      metadata: await ProductService.getProducts(req.query),
    }).send(res);
  }

  static async getProductDetail(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ErrorResponse(ERROR.PRODUCT.PRODUCT_NOT_FOUND);
    }

    return new SuccessResponse({
      message: "Product retrieved successfully",
      metadata: await ProductService.getProductDetail(req.params.id),
    }).send(res);
  }

  // static async createProduct(req, res) {
  //   return new SuccessResponse({
  //     message: "Product created successfully",
  //     metadata: { product: await ProductService.createProduct(req.body) },
  //   }).send(res);
  // }

  // static async updateProduct(req, res) {
  //   return new SuccessResponse({
  //     message: "Product updated successfully",
  //     metadata: {
  //       product: await ProductService.updateProduct(req.params.id, req.body),
  //     },
  //   }).send(res);
  // }
}
