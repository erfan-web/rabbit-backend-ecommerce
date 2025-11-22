const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyToken, logout);

module.exports = router;
