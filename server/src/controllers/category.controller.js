import { SuccessResponse } from "../core/response.js";
import CategoryService from "../services/category.service.js";

export default class CategoryController {
  static async getAllCategories(req, res) {
    return new SuccessResponse({
      message: "Categories retrieved successfully",
      metadata: { categories: await CategoryService.getAllCategories() },
    }).send(res);
  }

  static async createCategory(req, res) {
    return new SuccessResponse({
      message: "Category created successfully",
      metadata: { category: await CategoryService.createCategory(req.body) },
    }).send(res);
  }
}
