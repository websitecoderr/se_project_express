const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Avatar must be a valid image URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,

  },
});



userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    console.error(`Authentication failed: No user found with email ${email}`);
    throw new UnauthorizedError("Incorrect email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    console.error(`Authentication failed: Incorrect password for ${email}`);
    throw new UnauthorizedError("Incorrect email or password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
