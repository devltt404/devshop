export function setTokenCookie({ res, accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  res.cookie("session", new Date().getTime(), {
    httpOnly: false,
  });

  return { accessToken, refreshToken };
}

export function clearTokenCookie(res) {
  res.clearCookie("accessToken", { httpOnly: true });
  res.clearCookie("refreshToken", { httpOnly: true });
  res.clearCookie("session", { httpOnly: false });
}
