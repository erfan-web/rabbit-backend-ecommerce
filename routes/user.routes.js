const express = require("express");
const router = express.Router();
const {
  getMe,
  getAdmin,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.get("/profile", verifyToken, getMe);

router.get("/", verifyToken, isAdmin, getUsers);
router.post("/", verifyToken, isAdmin, addUser);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
