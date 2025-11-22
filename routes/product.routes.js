const express = require("express");
const router = express.Router();
const {
  getProducts,
  getSingleProduct,
  getSimilarProducts,
  getBestSellProducts,
  getNewArrivalsProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
``
router.get("/", getProducts);
router.get("/single/:id", getSingleProduct);
router.get("/similar/:id",getSimilarProducts);
router.get("/new-arrivals", getNewArrivalsProducts )
router.get("/best-seller",getBestSellProducts);
router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
