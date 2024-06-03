import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";
import { BadRequestError, UnauthorizedError } from "../core/error.response.js";
import { clearTokenCookie, setTokenCookie } from "../utils/auth.util.js";
import { checkMissingFields, getFieldsFromObject } from "../utils/index.js";
import { compareUserPassword, generateTokens } from "../utils/user.util.js";
import UserService from "./user.service.js";

export default class AuthService {
  // #region BUSINESS LOGIC

  /**
   * Authenticates a user.
   *
   * @param {Object} user - The user object.
   * @returns {Promise<Object>} - A promise that resolves to an object containing the specified fields from the user object.
   */
  static async authUser(user) {
    if (!user) return null;

    await user.populate("cart", "items");
    return getFieldsFromObject(["name", "email", "cart"], user);
  }

  /**
   * Refreshes the access token and generates a new refresh token for the user.
   * @returns {Promise<Object>} - An object containing the new access token, refresh token
   * @throws {UnauthorizedError} - If the old refresh token is invalid.
   * @throws {ForbiddenError} - If the old refresh token is valid but the user is not found.
   */
  static async refreshToken(oldRefreshToken, res) {
    try {
      if (!oldRefreshToken) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      let decoded;
      try {
        decoded = jwt.verify(oldRefreshToken, serverConfig.server.jwtSecret);
      } catch (error) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      const { userId } = decoded;
      const foundUser = await UserService.findUserById({
        userId,
      });

      if (!foundUser) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      const { accessToken, refreshToken } = generateTokens(foundUser);
      setTokenCookie({ accessToken, refreshToken, res });
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      clearTokenCookie(res);
      throw error;
    }
  }

  /**
   * Registers a new user by email.
   *
   * @param {Object} reqBody - The request body containing user information.
   * @param {string} reqBody.name - The name of the user.
   * @param {string} reqBody.email - The email of the user.
   * @param {string} reqBody.password - The password of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} - An object containing selected fields from the user (name, email).
   * @throws {BadRequestError} - If a user with the given email already exists.
   */
  static async register({ name, email, password }, res) {
    checkMissingFields({ name, email, password });

    const isUserExisted = await UserService.findUserByEmail({ email });
    if (isUserExisted) {
      throw new BadRequestError("User already existed", {
        errors: {
          email: "Email is already taken",
        },
      });
    }

    const newUser = await UserService.createUser({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    setTokenCookie({ accessToken, refreshToken, res });
    return getFieldsFromObject(["name", "email"], newUser);
  }

  /**
   * Logs in a user by email.
   *
   * @param {Object} reqBody - The request body containing the email and password.
   * @param {string} reqBody.email - The email of the user.
   * @param {string} reqBody.password - The password of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} - An object containing selected fields from the user (name, email).
   * @throws {BadRequestError} - If the email or password is incorrect.
   */
  static async login({ email, password }, res) {
    checkMissingFields({ email, password });

    const foundUser = await UserService.findUserByEmail({
      email,
      select: "password name email",
    });
    if (!foundUser || !(await compareUserPassword(password, foundUser))) {
      throw new BadRequestError("Email or password is incorrect", {
        errors: {
          email: "Email or password is incorrect",
          password: "Email or password is incorrect",
        },
      });
    }

    const { accessToken, refreshToken } = generateTokens(foundUser);

    setTokenCookie({ accessToken, refreshToken, res });
    return getFieldsFromObject(["name", "email"], foundUser);
  }

  /**
   * Logs out a user by clearing the access token and refresh token cookies.
   *
   * @param {Object} res - The response object.
   * @returns {Object} - An empty object.
   */
  static logout(res) {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    return {};
  }
  // #endregion BUSINESS LOGIC
}
