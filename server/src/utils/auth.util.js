export function setTokenCookie({ res, accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  return { accessToken, refreshToken };
}
