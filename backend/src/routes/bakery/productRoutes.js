const { Router } = require("express");
const {
  createProduct,
  getMyProducts,
  getMyProduct,
  updateMyProduct,
  deleteMyProduct,
} = require("../../controllers/bakery/productController");
const uploadProductImage = require("../../middleware/uploadMiddleware");

const router = Router();

// POST/PUT accept multipart/form-data with an optional "image" file
router.post("/", uploadProductImage, createProduct);
router.get("/", getMyProducts);
router.get("/:id", getMyProduct);
router.put("/:id", uploadProductImage, updateMyProduct);
router.delete("/:id", deleteMyProduct);

module.exports = router;
