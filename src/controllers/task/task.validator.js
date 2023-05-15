const Joi = require("joi");

export const create = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  due_date: Joi.date().required(),
  completion_date: Joi.date().allow(null).optional(),
  completion_status: Joi.allow(null).optional(),
  attachments: Joi.allow(null).optional(),
});

export const taskById = Joi.object({
  id: Joi.number().required(),
});
