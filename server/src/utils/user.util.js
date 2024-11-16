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

export async function getAndValidateUser({
  userId,
  select = profileSelect,
  lean = false,
}) {
  const user = await UserModel.findById(userId).select(select).lean(lean);
  if (!user) {
    throw new ErrorResponse(ERROR.USER.INVALID_USER);
  }

  return user;
}