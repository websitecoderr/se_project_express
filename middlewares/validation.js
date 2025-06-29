const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.base": '"name" must be a string',
      "string.min": '"name" must be at least 2 characters',
      "string.max": '"name" must be at most 30 characters',
      "any.required": '"name" is required',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": '"imageUrl" is required',
      "string.uri": '"imageUrl" must be a valid URL',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": '"name" must be at least 2 characters',
      "string.max": '"name" must be at most 30 characters',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": '"avatar" must be a valid URL',
      "any.required": '"avatar" is required',
    }),
    email: Joi.string().email().required().messages({
      "string.email": '"email" must be a valid email',
      "any.required": '"email" is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": '"password" is required',
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": '"email" must be a valid email',
      "any.required": '"email" is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": '"password" is required',
    }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.hex": '"userId" must be a hexadecimal string',
      "string.length": '"userId" must be 24 characters',
      "any.required": '"userId" is required',
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": '"itemId" must be a hexadecimal string',
      "string.length": '"itemId" must be 24 characters',
      "any.required": '"itemId" is required',
    }),
  }),
});

module.exports = {
  validateClothingItemBody,
  validateUserBody,
  validateAuthentication,
  validateUserId,
  validateItemId,
  validateURL, 
};
