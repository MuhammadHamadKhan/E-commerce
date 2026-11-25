const { Router } = require("express");
const { placeCustomerOrder, getOrderByPickupCode } = require("../../controllers/customer/orderController");
const { orderLimiter, pickupLimiter } = require("../../middleware/rateLimiters");

const router = Router();

router.post("/", orderLimiter, placeCustomerOrder);
router.get("/pickup/:code", pickupLimiter, getOrderByPickupCode);

module.exports = router;
