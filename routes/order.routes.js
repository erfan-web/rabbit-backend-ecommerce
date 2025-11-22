const express = require("express");
const router = express.Router();
const {
  getOrder,
  getUserOrder,
  getOrders,
  updateOrder,
} = require("../controllers/order.controller");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/user-orders", verifyToken, getUserOrder);
router.get("/single/:id", verifyToken, getOrder);

router.get("/", verifyToken, isAdmin, getOrders);
router.put("/:id", verifyToken, isAdmin, updateOrder);

module.exports = router;
