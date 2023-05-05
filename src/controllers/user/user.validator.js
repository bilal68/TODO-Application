const Joi = require("joi");

export const purchase = Joi.object({
  userId: Joi.string().guid({
    version: ["uuidv4"],
  }),
  menuId: Joi.string().guid({
    version: ["uuidv4"],
  }),
});
