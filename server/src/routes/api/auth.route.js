import express from "express";
import AuthController from "../../controllers/auth.controller.js";
import { isAuthorized } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";

const authRoutes = express.Router();

authRoutes.post("/refresh-token", asyncHandler(AuthController.refreshToken));
authRoutes.post("/register", asyncHandler(AuthController.register));
authRoutes.post("/login", asyncHandler(AuthController.login));
authRoutes.post("/logout", asyncHandler(AuthController.logout));

authRoutes.get("/", isAuthorized, asyncHandler(AuthController.authUser));

export default authRoutes;
