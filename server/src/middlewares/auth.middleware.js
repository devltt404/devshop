import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";
import USER from "../constants/user.constant.js";
import ERROR from "../core/error.response.js";
import { ErrorResponse } from "../core/response.js";
import UserService from "../services/user.service.js";

const checkAuthentication =
  ({ optional } = { optional: false }) =>
  async (req, res, next) => {
    try {
      const { session } = req.cookies;
      if (!session && optional) {
        return next();
      }
      const selectedUserFields = "_id name email cart role picture";

      const { accessToken } = req.cookies;

      // Check if access token is missing
      if (!accessToken) {
        throw new ErrorResponse(ERROR.AUTH.MISSING_ACCESS_TOKEN);
      }

      // Verify access token
      let decode;
      try {
        decode = jwt.verify(accessToken, serverConfig.server.jwtSecret);
      } catch (error) {
        throw new ErrorResponse(ERROR.AUTH.UNABLE_DECODE_ACCESS_TOKEN);
      }

      const { userId } = decode;

      // Check if user exists
      const foundUser = await UserService.findUserById({
        userId,
        select: selectedUserFields,
      });

      if (!foundUser) {
        throw new ErrorResponse(ERROR.AUTH.INVALID_CREDENTIAL);
      }

      req.user = foundUser;
      next();
    } catch (error) {
      next(error);
    }
  };

export const checkPermission = ({ roles }) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(ERROR.AUTH.INVALID_PERMISSION));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware combinations
export const isAuthorized = checkAuthentication();
export const isOptionallyAuthorized = checkAuthentication({ optional: true });
export const isCustomer = [
  checkAuthentication(),
  checkPermission({ roles: [USER.ROLE.CUSTOMER] }),
];
export const isAdmin = [
  checkAuthentication(),
  checkPermission({ roles: [USER.ROLE.ADMIN] }),
];
