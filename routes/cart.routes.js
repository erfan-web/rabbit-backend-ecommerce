const express = require("express");
const router = express.Router();
const {
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getCart,
  mergeCart,
} = require("../controllers/cart.controller");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", addCartItem);
router.put("/", updateCartItem);
router.delete("/", deleteCartItem);
router.get("/", getCart);
router.post("/merge", verifyToken, mergeCart);

module.exports = router;
