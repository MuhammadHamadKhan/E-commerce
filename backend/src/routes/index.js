const { Router } = require("express");
const productRoutes = require("./product.routes");

const router = Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "E-commerce API v1" });
});

router.use("/products", productRoutes);

module.exports = router;
