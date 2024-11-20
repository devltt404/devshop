import { VALIDATE_OPTION } from "../constants/index.js";
import { ErrorResponse } from "../core/response.js";

export default function validate(schema, type = VALIDATE_OPTION.body) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[type], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = {};
      error.details.forEach((err) => {
        errors[err.path] = err.message;
      });

      next(
        new ErrorResponse({
          status: 400,
          message: "Validation Error",
          errors,
        })
      );
    } else {
      req[type] = value;
      next();
    }
  };
}
