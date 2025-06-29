const express = require("express");
const { getItems } = require("../controllers/clothingItems");
const { updateCurrentUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.put("/me", auth, updateCurrentUser);
router.get("/me", auth, getCurrentUser);
router.get("/items", getItems);

module.exports = router;
