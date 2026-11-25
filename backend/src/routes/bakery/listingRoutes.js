const { Router } = require("express");
const {
  createListing,
  getMyListings,
  updateMyListing,
  deleteMyListing,
} = require("../../controllers/bakery/listingController");

const router = Router();

router.post("/", createListing);
router.get("/", getMyListings);
router.put("/:id", updateMyListing);
router.delete("/:id", deleteMyListing);

module.exports = router;
