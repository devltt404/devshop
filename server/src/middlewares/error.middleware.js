import serverConfig from "../configs/server.config.js";
import { ErrorResponse } from "../core/response.js";
import logger from "../logger.js";
import {
  deleteUploadByFile,
  deleteUploadByFiles,
} from "../utils/cloudinary.util.js";

// 404 Not Found Handler
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`${req.method} ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};

// Error Handling Middleware
export const errorHandler = (error, req, res, next) => {
  logger.error(error);

  // Delete uploaded files if error occurs
  if (req.file) {
    deleteUploadByFile(req.file);
  }
  if (req.files) {
    deleteUploadByFiles(req.files);
  }

  //Handle mongoose validation error
  if (error.name === "ValidationError") {
    error.status = 400;
    error.message = "Validation error. Please check your fields.";

    // Format the errors field
    let tempErrors = {};
    error.errors = Object.keys(error.errors).map((key) => {
      tempErrors[key] = error.errors[key].message;
    });
    error.errors = tempErrors;
  }

  const status = error.status || 500;
  let message = error.message || "Something went wrong. Please try again.";

  // If in production mode, hide the message for internal server errors
  if (status === 500 && serverConfig.isPro) {
    message = "Internal server error. Please try again.";
  }

  const errorResponse = new ErrorResponse({
    message,
    errors: error.errors,
    code: error.code,
  });
  res.status(status).json(errorResponse);
};
