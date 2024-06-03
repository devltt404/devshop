import express from "express";
import ProductController from "../../controllers/product.controller.js";
import { isAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";

const productRoutes = express.Router();

//! PUBLIC
productRoutes.get("/", asyncHandler(ProductController.getProducts));
productRoutes.get("/:id", asyncHandler(ProductController.getProductDetailById));

//! ADMIN
productRoutes.post("/", isAdmin, asyncHandler(ProductController.createProduct));
productRoutes.patch(
  "/:id",
  isAdmin,
  asyncHandler(ProductController.updateProduct)
);

export default productRoutes;
