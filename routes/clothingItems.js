const express = require("express");
const {
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", getItems);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
