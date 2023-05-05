const Joi = require("joi");
const moment = require("moment");

const timeValidationMethod = (value, helpers) => {
  if (!moment(value, "HH:mm").isValid()) {
    return helpers.message("Time is not valid");
  } else {
    return true;
  }
};

export const getRestaurants = Joi.object({
  day: Joi.string()
    .required()
    .regex(
      /((\bmonday\b|\btuesday\b|\bwednesday\b|\bthursday\b|\bfriday\b|\bsaturday\b|\bsunday\b))/
    ),
  from: Joi.string()
    .required()
    .regex(/^([0-9]{2})\:([0-9]{2})$/)
    .custom(timeValidationMethod, "custom validation"),
  to: Joi.string()
    .required()
    .regex(/^([0-9]{2})\:([0-9]{2})$/)
    .custom(timeValidationMethod, "custom validation"),
});

export const fetchRestaurantsParams = Joi.object({
  numberOfDishes: Joi.number().required(),
});

export const fetchRestaurantsQuery = Joi.object({
  minPrice: Joi.number().required(),
  maxPrice: Joi.number().required(),
});

export const search = Joi.object({
  searchString: Joi.string().required(),
});
