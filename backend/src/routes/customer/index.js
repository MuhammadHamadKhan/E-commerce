const { Router } = require("express");
const listingRoutes = require("./listingRoutes");
const bakeryRoutes = require("./bakeryRoutes");
const browseRoutes = require("./browseRoutes");
const orderRoutes = require("./orderRoutes");

const router = Router();

// All public customer routes: no login required
router.use("/listings", listingRoutes);
router.use("/bakeries", bakeryRoutes);
router.use("/browse", browseRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
