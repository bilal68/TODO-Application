const Joi = require("joi");

export const create = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  due_date: Joi.date().required(),
  completion_date: Joi.date(),
  completion_status: Joi.boolean(),
});

export const taskById = Joi.object({
  id: Joi.number().required(),
});
