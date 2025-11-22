const express = require("express");
const router = express.Router();
const {
  createCheckout,
  verifyCheckout,
} = require("../controllers/checkout.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/create", verifyToken, createCheckout);
router.get("/verify", verifyToken, verifyCheckout);

module.exports = router;
