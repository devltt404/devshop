import axios from "axios";
import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";
import USER from "../constants/user.constant.js";
import { ForbiddenError, UnauthorizedError } from "../core/error.response.js";
import UserService from "../services/user.service.js";
import { setTokenCookie } from "../utils/auth.util.js";

export const checkAuthentication =
  ({ optional } = { optional: false }) =>
  async (req, res, next) => {
    try {
      const selectedUserFields = "_id name email cart role";

      const { accessToken } = req.cookies;

      // Check if access token is missing
      if (!accessToken) {
        throw new UnauthorizedError("Tokens are missing.");
      }

      try {
        // Verify access token
        const decode = jwt.verify(accessToken, serverConfig.server.jwtSecret);
        const { userId } = decode;

        const foundUser = await UserService.findUserById({
          userId,
          select: selectedUserFields,
          lean: false,
        });

        if (!foundUser) {
          throw new UnauthorizedError("Invalid access token");
        }

        req.user = foundUser;
        next();
      } catch (error) {
        // If token is expired, refresh token
        if (error.name === "TokenExpiredError") {
          const { refreshToken } = req.cookies;
          if (!refreshToken) {
            throw new ForbiddenError("Refresh token is missing.");
          }

          let response;
          try {
            response = await axios.post(
              `${serverConfig.server.baseUrl}:${serverConfig.server.port}${serverConfig.server.apiBaseUrl}/auth/refresh-token`,
              { refreshToken }
            );
          } catch (error) {
            const forwardError = new Error();
            forwardError.status = error.response.status;
            forwardError.message = error.response.data.message;
            throw forwardError;
          }

          const foundUser = await UserService.findUserById({
            userId: response.data.metadata.userId,
            select: selectedUserFields,
            lean: false,
          });

          if (!foundUser) {
            throw new ForbiddenError("Invalid refresh token");
          }

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.metadata;

          setTokenCookie({
            res,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
          req.user = foundUser;
          next();
        } else {
          // Throw error if token is invalid
          throw new UnauthorizedError("Invalid access token");
        }
      }
    } catch (error) {
      if (optional) {
        return next();
      }
      next(error);
    }
  };

export const checkPermission = ({ roles }) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(
          new ForbiddenError("You don't have permission to access this path.")
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware combinations
export const isAuthorized = checkAuthentication();
export const isOptionalAuthorized = checkAuthentication({ optional: true });
export const isCustomer = [
  checkAuthentication(),
  checkPermission({ roles: [USER.ROLE.CUSTOMER] }),
];
export const isAdmin = [
  checkAuthentication(),
  checkPermission({ roles: [USER.ROLE.ADMIN] }),
];
