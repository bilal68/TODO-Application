import { generateToken } from "../../config/jwt";
import { successResponse, errorResponse } from "../../helpers";

export const login = async (req, res) => {
  try {
    const token = generateToken({ userId: req.user.id, loginType: "local" });
    return successResponse(req, res, {
      message: "LoggedIn successfully",
      token: token,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
