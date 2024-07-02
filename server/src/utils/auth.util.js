export function getCommonAuthParams( req, res ) {
  return {
    ...req.body,
    guestCartId: req.cookies?.cartId,
    res,
  };
}

export function setTokenCookie({ res, accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("session", new Date().getTime(), {
    httpOnly: false,
    sameSite: "strict",
  });

  return { accessToken, refreshToken };
}

export function clearTokenCookie(res) {
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("session", { httpOnly: false, sameSite: "strict" });
}
