import express from "express";
import { CLOUDINARY } from "../../constants/index.js";
import UserController from "../../controllers/user.controller.js";
import { isAuthorized } from "../../middlewares/auth.middleware.js";
import {
  logUploadDetails,
  uploadCloud,
} from "../../middlewares/upload.middleware.js";
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
  asyncHandler(UserController.updateUserProfile)
);

userRoutes.put(
  "/picture",
  isAuthorized,
  uploadCloud({
    folderName: CLOUDINARY.FOLDER.USER,
    allowedFormats: CLOUDINARY.ALLOWED_FORMATS.IMAGE,
  }).single("picture"),
  logUploadDetails,
  asyncHandler(UserController.updateUserPicture)
);

export default userRoutes;
