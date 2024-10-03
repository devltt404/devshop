import serverConfig from "../configs/server.config.js";
import ms from 'ms'

export function getCommonAuthParams(req, res) {
  return {
    ...req.body,
    guestCartId: req.cookies?.cartId,
    res,
  };
}

export function setTokenCookie({ res, accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: serverConfig.isPro,
    maxAge: ms(serverConfig.server.accessTokenExpiration),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: serverConfig.isPro,
    maxAge: ms(serverConfig.server.refreshTokenExpiration),
  });

  // This lets the client know if it should authenticate the user
  res.cookie("session", new Date().getTime(), {
    httpOnly: false,
  });

  return { accessToken, refreshToken };
}

export function clearTokenCookie(res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: serverConfig.isPro,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: serverConfig.isPro,
  });
  res.clearCookie("session", { httpOnly: false });
}
