const { Router } = require("express");
const { getBrowse } = require("../../controllers/customer/browseController");

const router = Router();

// GET /api/browse - grouped discovery: ending soon, biggest discounts, bakeries
router.get("/", getBrowse);

module.exports = router;
