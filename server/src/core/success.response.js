import { RESPONSE_MESSAGES } from "../constants/http/responseMessages.constant.js";
import { STATUS_CODES } from "../constants/http/statusCodes.constant.js";

export class SuccessResponse {
  constructor({
    message = RESPONSE_MESSAGES.OK,
    status = STATUS_CODES.OK,
    metadata = {},
  }) {
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
