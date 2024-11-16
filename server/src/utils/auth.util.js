import ms from "ms";
import serverConfig from "../configs/server.config.js";
import { COOKIE_KEY } from "../constants/index.js";
import { clearCookie, setCookie } from "./cookie.util.js";

export function getCommonAuthParams(req, res) {
  return {
    ...req.body,
    guestCartId: req.cookies?.cartId,
    res,
  };
}

export function setTokenCookie({ res, accessToken, refreshToken }) {
  setCookie(res, COOKIE_KEY.ACCESS_TOKEN, accessToken, {
    maxAge: ms(serverConfig.server.accessTokenExpiration),
  });
  setCookie(res, COOKIE_KEY.REFRESH_TOKEN, refreshToken, {
    maxAge: ms(serverConfig.server.refreshTokenExpiration),
  });

  return { accessToken, refreshToken };
}

export function clearTokenCookie(res) {
  clearCookie(res, COOKIE_KEY.ACCESS_TOKEN);
  clearCookie(res, COOKIE_KEY.REFRESH_TOKEN);
}

export function handleToken({ user, res }) {
  const { accessToken, refreshToken } = generateTokens(user);
  setTokenCookie({ accessToken, refreshToken, res });
}

export async function handleCart({ user, guestCartId, res }) {
  await assignGuestCartToUser({
    userId: user._id,
    cartId: guestCartId,
    res,
  });

  clearCartCookie(res);
}