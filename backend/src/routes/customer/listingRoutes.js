const { Router } = require("express");
const { getActiveListings, getActiveListing } = require("../../controllers/customer/listingController");

const router = Router();

router.get("/", getActiveListings);
router.get("/:id", getActiveListing);

module.exports = router;
