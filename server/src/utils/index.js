import lodash from "lodash";
import { BadRequestError } from "../core/error.response.js";

export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function getFieldsFromObject(fields, obj) {
  return lodash.pick(obj, fields);
}

export function checkMissingFields({ ...requiredFields }) {
  const missingFields = {};
  for (const field in requiredFields) {
    if (!requiredFields[field]) {
      missingFields[field] = "This field is required";
    }
  }
  if (Object.keys(missingFields).length > 0) {
    throw new BadRequestError("Please provide all required fields", {
      errors: missingFields,
    });
  }
}

export function toCapitalize(str) {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export async function delayAsync(s) {
  return await new Promise((resolve) => setTimeout(resolve, s * 1000));
}
