const Joi = require("joi");


export const taskById = Joi.object({
  id: Joi.number().required(),
});
