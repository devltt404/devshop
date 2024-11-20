import Joi from "joi";
import { PRODUCT_FACET_FIELD, PRODUCT_SORT_FIELD } from "../constants/index.js";

export const getProductsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  key: Joi.string().optional(),
  sortBy: Joi.string()
    .valid(...Object.keys(PRODUCT_SORT_FIELD))
    .default("ctime"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  categoryId: Joi.string().optional(),
  minRating: Joi.number().min(0).max(5).optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  facet: Joi.string()
    .valid(...Object.keys(PRODUCT_FACET_FIELD))
    .optional(),
  catFacet: Joi.string().optional(),
});
