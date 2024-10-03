import ms from "ms";
import serverConfig from "../configs/server.config.js";

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
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: serverConfig.isPro,
    maxAge: ms(serverConfig.server.refreshTokenExpiration),
    sameSite: "None",
  });

  // This lets the client know if it should authenticate the user
  res.cookie("session", new Date().getTime(), {
    httpOnly: false,
    sameSite: "None",
  });

  return { accessToken, refreshToken };
}

export function clearTokenCookie(res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: serverConfig.isPro,
    sameSite: "None",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: serverConfig.isPro,
    sameSite: "None",
  });
  res.clearCookie("session", { httpOnly: false, sameSite: "None" });
}
