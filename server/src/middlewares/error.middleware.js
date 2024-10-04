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
  // Delete uploaded files if error occurs
  if (req.file) {
    deleteUploadByFile(req.file);
  }
  if (req.files) {
    deleteUploadByFiles(req.files);
  }

  // Handle unexpected error
  if (!error.status) {
    error.status = 500;
    logger.error(error);
  }

  // Hide server error message in production
  if (error.status === 500 && serverConfig.isPro) {
    error.message = "Internal server error. Please try again.";
  }

  //Handle mongoose validation error
  else if (error.name === "ValidationError") {
    error.status = 400;
    error.message = "Validation error. Please check your fields.";

    // Format the errors field
    let tempErrors = {};
    error.errors = Object.keys(error.errors).map((key) => {
      tempErrors[key] = error.errors[key].message;
    });
    error.errors = tempErrors;
  }

  const errorResponse = new ErrorResponse({
    message: error.message,
    errors: error.errors,
    code: error.code,
  });
  res.status(error.status).json(errorResponse);
};
