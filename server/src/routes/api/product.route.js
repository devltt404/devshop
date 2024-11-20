import express from "express";
import ProductController from "../../controllers/product.controller.js";
import { isAdmin } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
import { getProductsSchema } from "../../validations/product.schema.js";
import { VALIDATE_OPTION } from "../../constants/index.js";

const productRoutes = express.Router();

//! PUBLIC
productRoutes.get(
  "/",
  validate(getProductsSchema, VALIDATE_OPTION.query),
  asyncHandler(ProductController.getProducts)
);
productRoutes.get("/:id", asyncHandler(ProductController.getProductDetail));

//! ADMIN
productRoutes.post("/", isAdmin, asyncHandler(ProductController.createProduct));
productRoutes.patch(
  "/:id",
  isAdmin,
  asyncHandler(ProductController.updateProduct)
);

export default productRoutes;
