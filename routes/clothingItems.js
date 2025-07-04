const express = require("express");
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");
const { validateCreateItem, validateItemId } = require("../utils/validators");

const router = express.Router();

router.get("/", getItems);

router.post("/", auth, validateCreateItem, createItem);

router.delete("/:id", auth, validateItemId, deleteItem);

router.put("/:id/likes", auth, validateItemId, likeItem);

router.delete("/:id/likes", auth, validateItemId, dislikeItem);

module.exports = router;
