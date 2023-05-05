const jwt = require("jsonwebtoken");

import { successResponse, errorResponse } from "../helpers";

export const generateToken = (options) => {
  try {
    const token = jwt.sign({ ...options }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return token;
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
