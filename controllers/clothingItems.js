const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { validateId } = require("../utils/validators");

const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  SERVER_ERROR,
  CREATED,
  OK,
} = require("../utils/statusCodes");

const createItem = async (req, res) => {
  const owner = req.user._id;
  try {
    const { name, imageUrl, weather } = req.body;

    if (!name || !weather) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Name and weather are required" });
    }

    const newItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });

    return res.status(CREATED).json(newItem);
  } catch (err) {
    console.error("Error creating item:", err);
    return res.status(SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.status(OK).json(items);
  } catch (err) {
    console.error("Error retrieving items:", err);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Failed to retrieve items" });
  }
};

const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!validateId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    return res.status(OK).json(item);
  } catch (err) {
    console.error("Error liking item:", err);
    return res.status(SERVER_ERROR).json({ message: "Error updating item" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!validateId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    return res.status(OK).json(item);
  } catch (err) {
    console.error("Error disliking item:", err);
    return res.status(SERVER_ERROR).json({ message: "Failed to dislike item" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!validateId(itemId)) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid item ID format" });
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(FORBIDDEN)
        .json({ message: "You are not authorized to delete this item" });
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(OK).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    return res.status(SERVER_ERROR).json({ message: "Internal server error" });
  }
};

module.exports = {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
};
