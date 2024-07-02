import express from "express";
import UserController from "../../controllers/user.controller.js";
import { isAuthorized } from "../../middlewares/auth.middleware.js";
import uploadCloud from "../../middlewares/cloudinary.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
const userRoutes = express.Router();

// USER
userRoutes.get(
  "/profile",
  isAuthorized,
  asyncHandler(UserController.getUserProfile)
);
userRoutes.patch(
  "/profile",
  isAuthorized,
  uploadCloud.single("picture"),
  asyncHandler(UserController.updateUserProfile)
);

export default userRoutes;
