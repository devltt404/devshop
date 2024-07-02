export class SuccessResponse {
  constructor({ message = "Success", status = 200, metadata = {} }) {
    this.message = message;
    this.status = status;
    this.metadata = metadata;
  }

  send(res) {
    res.status(this.status).json({
      status: "success",
      message: this.message,
      metadata: this.metadata,
    });
  }
}

export class ErrorResponse extends Error {
  constructor({ message, status, errors, code }) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}
