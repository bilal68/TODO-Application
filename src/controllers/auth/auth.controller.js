import * as model from "../../models";
import { generateToken } from "../../config/jwt";
import {
  successResponse,
  errorResponse,
  generatePasswordHash,
} from "../../helpers";

export const handleOAuthCallback = async (req, res, next) => {
  try {
    const { email, given_name: first_name, family_name: last_name } = req.user;
    const newUser = {
      email,
      first_name,
      last_name,
      user_type: "OAUTH2",
      is_verified: true,
    };
    const createdUser = await createUserInDb(newUser, false);
    if (!createdUser) throw "something went wrong!";
    req.user = createdUser;
    login(req, res);
    // }
  } catch (error) {
    // Handle any errors that occur during the authentication process
    console.error("OAuth2 authentication error:", error);
    return errorResponse(req, res, error.message);
  }
};

export const userRegister = async (req, res) => {
  try {
    const result = await createUserInDb(req.body);
    return successResponse(req, res, {
      message: "Success",
      data: result,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const createUserInDb = async (data, localUserFlag = true) => {
  try {
    const { email } = data;

    let existingUser = await model.user.findOne({ where: { email: email } });
    if (existingUser && existingUser.verification_code)
      return "Email already exists but not yet verified";
    else existingUser;

    // send email to user
    if (localUserFlag) {
      data.password = await generatePasswordHash(password);
      data["verification_code"] = verificationCode();
      await sendEmail(
        data.email,
        "Verification Code",
        `Your verification code is ${data["verification_code"]}.`
      );
    }
    let result = await model.user.create(data);
    result = result.toJSON();
    delete result.password;
    delete result["verification_code"];
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const login = async (req, res) => {
  try {
    const token = generateToken({
      userId: req.user.id,
      loginType: req.user.user_type,
    });
    return successResponse(req, res, {
      message: "LoggedIn successfully",
      token: token,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
