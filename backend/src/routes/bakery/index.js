const { Router } = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const { requireBakeryOwner } = require("../../middleware/authMiddleware");
const productRoutes = require("./productRoutes");
const listingRoutes = require("./listingRoutes");
const orderRoutes = require("./orderRoutes");
const profileRoutes = require("./profileRoutes");

const router = Router();

// Every /api/bakery route: logged in + bakery_owner role
router.use(authMiddleware, requireBakeryOwner);

// ...and a bakery row must exist for this owner
router.use((req, res, next) => {
  if (!req.user.bakeryId) {
    return res.status(404).json({ success: false, message: "No bakery found for this account" });
  }
  next();
});

router.use("/products", productRoutes);
router.use("/listings", listingRoutes);
router.use("/orders", orderRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
