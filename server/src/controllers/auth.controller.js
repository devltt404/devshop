import { SuccessResponse } from "../core/response.js";
import AuthService from "../services/auth.service.js";
import { getCommonAuthParams } from "../utils/auth.util.js";

export default class AuthController {
  static async authUser(req, res) {
    new SuccessResponse({
      message: "User authenticated successfully",
      metadata: await AuthService.authUser(req.user),
    }).send(res);
  }

  static async refreshToken(req, res) {
    new SuccessResponse({
      message: "Token refreshed successfully",
      metadata: await AuthService.refreshToken(req.cookies.refreshToken, res),
    }).send(res);
  }

  static async authGoogle(req, res) {
    new SuccessResponse({
      message: "User authenticated with Google successfully",
      metadata: await AuthService.authGoogle(getCommonAuthParams(req, res)),
    }).send(res);
  }

  static async login(req, res) {
    new SuccessResponse({
      message: "User logged in successfully",
      metadata: await AuthService.login(getCommonAuthParams(req, res)),
    }).send(res);
  }

  static async register(req, res) {
    new SuccessResponse({
      status: 201,
      message: "User registered successfully",
      metadata: await AuthService.register(getCommonAuthParams(req, res)),
    }).send(res);
  }

  static async logout(req, res) {
    new SuccessResponse({
      message: "User logged out successfully",
      metadata: AuthService.logout(res),
    }).send(res);
  }
}
