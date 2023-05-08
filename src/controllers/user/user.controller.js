import * as model from "../../models";
import { sendEmail } from "../../services/email";
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

    // send email to user
    await sendEmail(
      req.body.email,
      "Verification Code",
      `Your verification code is ${req.body["verification_code"]}.`
    );
    let result = await model.user.create(req.body);
    result = result.toJSON();
    delete result.password;
    delete result["verification_code"];
    return successResponse(req, res, {
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const verifyEmailAddress = async (req, res) => {
  try {
    const { verificationCode } = req.query;

    let result = await model.user.update(
      { is_verified: true },
      { where: { verification_code: verificationCode }, returning: true }
    );
    if (!result) {
      throw new Error("User not found");
    }
    return successResponse(req, res, {
      message: "User email verified successfully",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
