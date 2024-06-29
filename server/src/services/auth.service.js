import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";
import { BadRequestError, UnauthorizedError } from "../core/error.response.js";
import { clearTokenCookie, setTokenCookie } from "../utils/auth.util.js";
import { assignCartToUser, clearCartCookie } from "../utils/cart.util.js";
import { checkMissingFields, getFieldsFromObject } from "../utils/index.js";
import { compareUserPassword, generateTokens } from "../utils/user.util.js";
import UserService from "./user.service.js";

export default class AuthService {
  // #region BUSINESS LOGIC
  static async authUser(user) {
    if (!user) return null;

    return getFieldsFromObject(["name", "email", "picture"], user);
  }

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

  static async register({ name, email, password, guestCartId, res }) {
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

    await assignCartToUser({
      userId: newUser._id,
      cartId: guestCartId,
      res,
    });
    setTokenCookie({ accessToken, refreshToken, res });
    clearCartCookie(res);

    return getFieldsFromObject(["name", "email"], newUser);
  }

  static async login({ email, password, guestCartId, res }) {
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

    await assignCartToUser({
      userId: foundUser._id,
      cartId: guestCartId,
      res,
    });
    setTokenCookie({ accessToken, refreshToken, res });
    clearCartCookie(res);
    return getFieldsFromObject(["name", "email"], foundUser);
  }

  static logout(res) {
    clearTokenCookie(res);
    clearCartCookie(res);
    return {};
  }
  // #endregion BUSINESS LOGIC
}
