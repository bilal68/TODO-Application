const Joi = require("joi");

export const create = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  due_date: Joi.date().required(),
  completion_date: Joi.date(),
  completion_status: Joi.boolean(),
});

// export const resetPassword = Joi.object({
//   password: Joi.string()
//     .required()
//     .pattern(new RegExp("^[a-zA-Z0-9]{3,10}$"))
//     .messages({
//       "string.base": "Password should be a string",
//       "string.empty": "Password is required",
//       "string.pattern.base":
//         "Password should be alphanumeric and between 3 and 30 characters long",
//       "any.required": "Password is required",
//     }),
//   confirm_password: Joi.string()
//     .required()
//     .valid(Joi.ref("password"))
//     .messages({
//       "any.only": "Passwords do not match",
//       "any.required": "Confirm password is required",
//     }),
// });
