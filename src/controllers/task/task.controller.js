import * as model from "../../models";
import { sendEmail } from "../../services/email";
import {
  successResponse,
  errorResponse,
  verificationCode,
  generatePasswordHash,
} from "../../helpers";
const moment = require("moment");

export const create = async (req, res) => {
  try {
    // const { password } = req.body;

    let result = await model.task.create(req.body);
    result = result.toJSON();
    return successResponse(req, res, {
      message: "Task created successfully",
      data: result,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
