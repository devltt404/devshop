import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import {
  clearTokenCookie,
  handleCart,
  handleToken,
  setTokenCookie,
} from "../utils/auth.util.js";
import { clearCartCookie } from "../utils/cart.util.js";
import { compareUserPassword, generateTokens } from "../utils/user.util.js";
import UserService from "./user.service.js";

export default class AuthService {
  static async authUser(user) {
    if (!user)
      return {
        user: null,
      };

    return {
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    };
  }

  static async refreshToken(oldRefreshToken, res) {
    try {
      if (!oldRefreshToken) {
        throw new ErrorResponse(ERROR.AUTH.MISSING_REFRESH_TOKEN);
      }

      let decoded;
      try {
        decoded = jwt.verify(oldRefreshToken, serverConfig.server.jwtSecret);
      } catch (error) {
        throw new ErrorResponse(ERROR.AUTH.UNABLE_DECODE_REFRESH_TOKEN);
      }

      const { userId } = decoded;
      const foundUser = await UserService.findUserById({
        userId,
      });

      if (!foundUser) {
        throw new ErrorResponse(ERROR.AUTH.INVALID_CREDENTIAL);
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

  static async authGoogle({ accessToken, guestCartId, res }) {
    // Fetch user info from Google
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = await response.json();

    let user;
    user = await UserService.findUserByEmail({
      email: userInfo.email,
    });

    if (!user) {
      user = await UserService.createUser({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      });
    }

    handleToken({ user, guestCartId, res });
    await handleCart({ user, guestCartId, res });

    return { user };
  }

  static async register({ name, email, password, guestCartId, res }) {
    const isUserExisted = await UserService.findUserByEmail({ email });
    if (isUserExisted) {
      throw new ErrorResponse(ERROR.AUTH.EMAIL_ALREADY_EXISTS);
    }

    const newUser = await UserService.createUser({
      name,
      email,
      password,
    });

    handleToken({ user: newUser, guestCartId, res });
    await handleCart({ user: newUser, guestCartId, res });

    return {
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  static async login({ email, password, guestCartId, res }) {
    const foundUser = await UserService.findUserByEmail({
      email,
      select: "password name email",
    });
    if (!foundUser || !(await compareUserPassword(password, foundUser))) {
      throw new ErrorResponse(ERROR.AUTH.INCORRECT_EMAIL_OR_PASSWORD);
    }

    handleToken({ user: foundUser, guestCartId, res });
    await handleCart({ user: foundUser, guestCartId, res });

    return {
      user: {
        name: foundUser.name,
        email: foundUser.email,
      },
    };
  }

  static logout(res) {
    clearTokenCookie(res);
    clearCartCookie(res);
    return {};
  }
}
