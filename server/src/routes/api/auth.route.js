import express from "express";
import AuthController from "../../controllers/auth.controller.js";
import { isAuthorized } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/helper.util.js";
import {
  authGoogleSchema,
  authLoginSchema,
  authRegisterSchema,
} from "../../validations/auth.schema.js";

const authRoutes = express.Router();

authRoutes.post("/refresh-token", asyncHandler(AuthController.refreshToken));
authRoutes.post(
  "/google",
  validate(authGoogleSchema),
  asyncHandler(AuthController.authGoogle)
);
authRoutes.post(
  "/register",
  validate(authRegisterSchema),
  asyncHandler(AuthController.register)
);
authRoutes.post(
  "/login",
  validate(authLoginSchema),
  asyncHandler(AuthController.login)
);
authRoutes.post("/logout", asyncHandler(AuthController.logout));

authRoutes.get("/", isAuthorized, asyncHandler(AuthController.authUser));

export default authRoutes;
