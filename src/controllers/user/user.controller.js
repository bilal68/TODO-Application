import * as model from "../../models";
import {
  successResponse,
  errorResponse,
  generateMd5Hash,
  verificationCode,
} from "../../helpers";
const moment = require("moment");

export const healthCheck = async (req, res) => {
  try {
    return successResponse(req, res, { message: "working" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const userRegister = async (req, res) => {
  try {
    const { password } = req.body;

    req.body.password = generateMd5Hash(password);
    req.body["verification_code"] = verificationCode();
    let result = await model.user.create(req.body);
    result = result.toJSON();
    delete result.password;
    delete result["verification_code"];
    // send email to user
    return successResponse(req, res, {
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
