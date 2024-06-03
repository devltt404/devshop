import { RESPONSE_MESSAGES } from "../constants/http/responseMessages.constant.js";
import { STATUS_CODES } from "../constants/http/statusCodes.constant.js";

class ErrorResponse extends Error {
  constructor(message, status, errors, code) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

const errorFactory = (defaultMessage, defaultStatus) => {
  return class extends ErrorResponse {
    constructor(message = defaultMessage, { errors, code } = {}) {
      super(message, defaultStatus, errors, code);
    }
  };
};

const NotFoundError = errorFactory(
  RESPONSE_MESSAGES.NOT_FOUND,
  STATUS_CODES.NOT_FOUND
);
const BadRequestError = errorFactory(
  RESPONSE_MESSAGES.BAD_REQUEST,
  STATUS_CODES.BAD_REQUEST
);
const UnauthorizedError = errorFactory(
  RESPONSE_MESSAGES.UNAUTHORIZED,
  STATUS_CODES.UNAUTHORIZED
);
const ForbiddenError = errorFactory(
  RESPONSE_MESSAGES.FORBIDDEN,
  STATUS_CODES.FORBIDDEN
);
const InternalServerError = errorFactory(
  RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
  STATUS_CODES.INTERNAL_SERVER_ERROR
);

export {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
};
