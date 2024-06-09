const express = require("express");
const {
  createProduct,
  getaProduct,
  productList,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.patch("/update-product/:id", authMiddleware, isAdmin, updateProduct);
router.get("/get-product/:id", getaProduct);
router.get("/all-products", productList);
router.delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
