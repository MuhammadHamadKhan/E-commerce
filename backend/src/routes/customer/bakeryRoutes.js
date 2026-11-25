const { Router } = require("express");
const { getBakeries, getBakeryDetails } = require("../../controllers/customer/bakeryController");

const router = Router();

router.get("/", getBakeries);
router.get("/:id", getBakeryDetails);

module.exports = router;
