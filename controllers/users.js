const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { logger } = require("../middlewares/logger");
const BadRequestError = require("../utils/errors/BadRequestError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ServerError = require("../utils/errors/ServerError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      logger.warn("Login attempt with unregistered email", {
        email,
        context: "login",
      });
      throw new UnauthorizedError("Incorrect email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Login attempt with incorrect password", {
        userId: user._id,
        context: "login",
      });
      throw new UnauthorizedError("Incorrect email or password");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(STATUS_CODES.OK).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        _id: user._id,
      },
    });
  } catch (error) {
    logger.error("Login failure", {
      message: error.message,
      stack: error.stack,
      context: "login",
    });
    return next(new ServerError("Internal server error"));
  }
};


const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    logger.error("Error retrieving user", {
      message: error.message,
      stack: error.stack,
      context: "getCurrentUser",
    });
    return next(new ServerError("Error retrieving user"));
  }
};


const createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password || !avatar) {
      throw new BadRequestError("All fields are required");
    }

    if (name.length < 2 || name.length > 30) {
      throw new BadRequestError("Name must be between 2 and 30 characters");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(STATUS_CODES.CREATED).json({
      token,
      user: {
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      },
    });
  } catch (error) {
    logger.error("Error creating user", {
      message: error.message,
      stack: error.stack,
      context: "createUser",
    });

    if (error.name === "ValidationError") {
      return next(new BadRequestError("Bad request: Invalid user data"));
    }

    return next(new ServerError("Internal server error"));
  }
};


const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return res.status(STATUS_CODES.OK).json(updatedUser);
  } catch (error) {
    logger.error("Error updating user", {
      message: error.message,
      stack: error.stack,
      context: "updateCurrentUser",
    });

    if (error.name === "ValidationError") {
      return next(new BadRequestError("Invalid data passed"));
    }

    return next(new ServerError("Internal server error"));
  }
};


module.exports = {
  getCurrentUser,
  createUser,
  updateCurrentUser,
  login,
};
