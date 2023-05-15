import * as model from "../../models";
import {
  successResponse,
  errorResponse,
  generatePasswordHash,
} from "../../helpers";

export const healthCheck = async (req, res) => {
  try {
    return successResponse(req, res, { message: "working" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const verifyEmailAddress = async (req, res) => {
  try {
    const { verificationCode } = req.query;

    const [, updatedRows] = await model.user.update(
      { is_verified: true, verification_code: null },
      { where: { verification_code: verificationCode }, returning: true }
    );
    if (updatedRows !== undefined && updatedRows === 0) {
      throw new Error("User not found");
    }
    return successResponse(req, res, {
      message: "User email verified successfully",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const newPassword = await generatePasswordHash(password);
    let result = await model.user.update(
      { password: newPassword },
      { where: { id: req.user.userId, user_type: "LOCAL" }, returning: true }
    );

    return successResponse(req, res, {
      message: "Password changed successfully",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
