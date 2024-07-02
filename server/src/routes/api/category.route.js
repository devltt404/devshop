import express from "express";
import CategoryController from "../../controllers/category.controller.js";
import { isAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
const categoryRoutes = express.Router();

//! PUBLIC
categoryRoutes.get("/", asyncHandler(CategoryController.getAllCategories));

//! ADMIN
categoryRoutes.post(
  "/",
  isAdmin,
  asyncHandler(CategoryController.createCategory)
);

export default categoryRoutes;
