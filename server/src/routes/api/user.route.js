import express from "express";
import { CLOUDINARY } from "../../constants/index.js";
import UserController from "../../controllers/user.controller.js";
import { isAuthorized } from "../../middlewares/auth.middleware.js";
import {
  logUploadDetails,
  uploadCloud,
} from "../../middlewares/upload.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
import { updatePictureSchema } from "../../validations/user.schema.js";
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
  validate(updatePictureSchema),
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
  validate(updatePictureSchema),
  asyncHandler(UserController.updateUserPicture)
);

export default userRoutes;
