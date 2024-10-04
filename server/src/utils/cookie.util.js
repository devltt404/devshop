export function setCookie(res, key, value, options) {
  res.cookie(key, value, {
    key,
    value,

    // Default options
    httpOnly: true,
    secure: true,
    sameSite: "None",
    ...options,
  });
}

export function clearCookie(res, key) {
  res.clearCookie(key, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
}
