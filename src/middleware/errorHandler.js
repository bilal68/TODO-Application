import { errorResponse } from "../helpers";

const errorHandler = (err, req, res, next) => {
  if (err && err.message === "validation error") {
    let messages = err.errors.map((e) => e.field);
    if (messages.length && messages.length > 1) {
      messages = `${messages.join(", ")} are required fields`;
    } else {
      messages = `${messages.join(", ")} is a required field`;
    }
    return errorResponse(req, res, messages, 400, err);
  } else if (
    err &&
    (err.message === "Incorrect email" || err.message === "Incorrect password")
  ) {
    return errorResponse(req, res, err.message, 401, err);
  } else {
    return errorResponse(req, res, "Internal server error", 500, err);
  }
};

export default errorHandler;
