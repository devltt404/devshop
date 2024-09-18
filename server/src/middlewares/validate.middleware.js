import { ErrorResponse } from "../core/response.js";

export default function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
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
    }
    next();
  };
}
