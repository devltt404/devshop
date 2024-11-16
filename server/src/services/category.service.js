import slugify from "slugify";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import CategoryModel from "../models/category.model.js";

export default class CategoryService {
  static async findOneCategory({ filter, select = "", lean = true }) {
    return await CategoryModel.findOne(filter).select(select).lean(lean);
  }

  static async findCategories({ filter, select = "", lean = true }) {
    return await CategoryModel.find(filter).select(select).lean(lean);
  }

  static async getAllCategories() {
    const categories = await CategoryModel.find({}).lean();

    const categoryMap = {};

    // Create a map of categories with selected fields.
    categories.forEach((category) => {
      categoryMap[category._id] = {
        ...category,
        children: [],
      };
    });

    const tree = [];

    categories.forEach((category) => {
      if (category.path) {
        // Get the parent id of the current category.
        const parentIds = category.path.split(",").filter((id) => id);

        // Get the last parent id.
        const parentId = parentIds[parentIds.length - 1];

        // Check if the parent id exists in the category map.
        if (parentId && categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[category._id]);
        } else {
          tree.push(categoryMap[category._id]);
        }
      } else {
        tree.push(categoryMap[category._id]);
      }
    });

    return tree;
  }

  static async createCategory({ name, description = "", parent }) {
    // Check if the category name already exists
    const isCategoryExist = await CategoryModel.findOne({
      $or: [{ name }, { slug: slugify(name, { lower: true }) }],
    }).lean();
    if (isCategoryExist) {
      throw new ErrorResponse(ERROR.CATEGORY.NAME_ALREADY_EXISTS);
    }

    // Check if the parent category exists
    let parentCategory;
    if (parent) {
      parentCategory = await CategoryModel.findById(parent).lean();
      if (!parentCategory) {
        throw new ErrorResponse(ERROR.CATEGORY.INVALID_PARENT_CATEGORY);
      }
    }

    // Create the new category
    let path = null;
    if (parentCategory) {
      if (!parentCategory.path) {
        path = `,${parentCategory._id},`;
      } else {
        path = `${parentCategory.path}${parentCategory._id},`;
      }
    }
    const newCategory = await CategoryModel.create({ name, description, path });
    return {
      name: newCategory.name,
      path: newCategory.path,
    };
  }
}
