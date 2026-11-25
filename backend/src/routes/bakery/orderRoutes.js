const { Router } = require("express");
const {
  getMyOrders,
  getMyOrder,
  getOrderByPickupCode,
  updateMyOrderStatus,
} = require("../../controllers/bakery/orderController");

const router = Router();

// Specific path first so it is not swallowed by /:id
router.get("/pickup/:code", getOrderByPickupCode);
router.get("/", getMyOrders);
router.get("/:id", getMyOrder);
router.patch("/:id/status", updateMyOrderStatus);

module.exports = router;
