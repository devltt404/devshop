export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function toCapitalize(str) {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export async function delayAsync(s) {
  return await new Promise((resolve) => setTimeout(resolve, s * 1000));
}
