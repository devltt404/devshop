import serverConfig from "../configs/server.config.js";

// 404 Not Found Handler
export const notFoundHandler = (req, res, next) => {
  const error = new Error("Path not found");
  error.status = 404;
  next(error);
};

// Error Handling Middleware
export const errorHandler = (error, req, res, next) => {
  console.error(error);

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
  const message =
    serverConfig.env !== "pro"
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
