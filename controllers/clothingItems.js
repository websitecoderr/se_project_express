const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
};

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({}).populate("owner", "-password");
    return res.status(STATUS_CODES.OK).json(items);
  } catch (err) {
    return next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, weather } = req.body;

    if (!name || !weather || !req.file) {
      throw new BadRequestError("Name, weather, and image are required");
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    return res.status(STATUS_CODES.CREATED).json(newItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid item data"));
    }
    return next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner.toString() !== req.user._id) {
      throw new ForbiddenError("You are not authorized to delete this item");
    }

    await item.deleteOne();
    return res.status(STATUS_CODES.OK).json({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    return res.status(STATUS_CODES.OK).json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    return res.status(STATUS_CODES.OK).json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
