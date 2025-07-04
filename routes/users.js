const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const { updateCurrentUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
});

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUserUpdate, updateCurrentUser);

module.exports = router;



