import { SuccessResponse } from "../core/success.response.js";
import AuthService from "../services/auth.service.js";

export default class AuthController {
  static async authUser(req, res) {
    new SuccessResponse({
      message: "User authenticated successfully",
      metadata: { user: await AuthService.authUser(req.user) },
    }).send(res);
  }

  static async refreshToken(req, res) {
    new SuccessResponse({
      message: "Token refreshed successfully",
      metadata: await AuthService.refreshToken(req.cookies.refreshToken, res),
    }).send(res);
  }

  static async register(req, res) {
    new SuccessResponse({
      status: 201,
      message: "User registered successfully",
      metadata: { user: await AuthService.register(req.body, res) },
    }).send(res);
  }

  static async login(req, res) {
    new SuccessResponse({
      message: "User logged in successfully",
      metadata: { user: await AuthService.login(req.body, res) },
    }).send(res);
  }

  static async logout(req, res) {
    new SuccessResponse({
      message: "User logged out successfully",
      metadata: await AuthService.logout(res),
    }).send(res);
  }
}
