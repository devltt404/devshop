import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";
import USER from "../constants/user.constant.js";
import { ForbiddenError, UnauthorizedError } from "../core/error.response.js";
import UserService from "../services/user.service.js";

const checkAuthentication =
  ({ optional } = { optional: false }) =>
  async (req, res, next) => {
    try {
      const selectedUserFields = "_id name email cart role";

      const { accessToken } = req.cookies;

      // Check if access token is missing
      if (!accessToken) {
        throw new UnauthorizedError("Tokens are missing.");
      }

      // Verify access token
      let decode;
      try {
        decode = jwt.verify(accessToken, serverConfig.server.jwtSecret);
      } catch (error) {
        throw new UnauthorizedError("Invalid access token");
      }

      const { userId } = decode;

      // Check if user exists
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
