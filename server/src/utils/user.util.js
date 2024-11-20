import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import serverConfig from "../configs/server.config.js";

export const compareUserPassword = async (password, user) => {
  return await bcrypt.compare(password, user.password);
};

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    serverConfig.server.jwtSecret,
    {
      expiresIn: serverConfig.server.accessTokenExpiration,
    }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    serverConfig.server.jwtSecret,
    {
      expiresIn: serverConfig.server.refreshTokenExpiration,
    }
  );

  return { accessToken, refreshToken };
};
