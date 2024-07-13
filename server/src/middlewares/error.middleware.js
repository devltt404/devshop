import serverConfig from "../configs/server.config.js";
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
  const message = !serverConfig.isPro
    ? error.message || "Something went wrong. Please try again."
    : "Internal server error. Please try again.";

  const errResponse = {
    status: "error",
    message,
  };

  errResponse.code = error.code;
  errResponse.errors = error.errors;

  res.status(status).json(errResponse);
};
