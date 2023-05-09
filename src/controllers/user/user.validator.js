const Joi = require("joi");

export const login = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const verifyEmailAddress = Joi.object({
  verificationCode: Joi.string().required(),
});

export const userRegister = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
});
