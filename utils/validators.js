const {celebrate, Joi} = require('celebrate')

const validateName = (name) => {
  if (!name) return { valid: false, message: "Name is required" };
  if (name.length < 2)
    return { valid: false, message: "Name must be at least 2 characters long" };
  if (name.length > 30)
    return { valid: false, message: "Name must not exceed 30 characters" };
  return { valid: true };
};

const validateURL = (url) => {
  const urlRegex = /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/;
  if (!url) return { valid: false, message: "Image URL is required" };
  if (!urlRegex.test(url))
    return { valid: false, message: "Image URL must be a valid URL" };
  return { valid: true };
};

const validateId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
});
const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().required().uri(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});


module.exports = { validateName, validateURL, validateId, updateUserValidator , validateCreateItem, validateItemId};
