export class SuccessResponse {
  constructor({ message = "Success", status = 200, metadata = {} }) {
    this.message = message;
    this.status = status;
    this.metadata = metadata;
  }

  send(res) {
    res.status(this.status).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}

export class ErrorResponse extends Error {
  constructor({ message, errors, code, status }) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }

  // Remove extra properties of Error before sending response
  toJSON() {
    return {
      status: this.status,
      message: this.message,
      errors: this.errors,
      code: this.code,
    };
  }
}
