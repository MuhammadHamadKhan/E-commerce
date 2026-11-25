const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const { jwt: jwtConfig } = require("../../config");
const { placeOrder } = require("../../db/placeOrder");

// Simple email/phone format checks (kept lenient on purpose)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

// Highest amount a customer can order of one item
const MAX_QUANTITY_PER_ITEM = 20;

// POST /api/orders - guest checkout (login optional)
async function placeCustomerOrder(req, res, next) {
  try {
    const { customer_name, customer_phone, customer_email, items } = req.body;

    // --- validate customer details ---
    if (!customer_name || String(customer_name).trim() === "") {
      return res.status(400).json({ success: false, message: "customer_name is required" });
    }
    if (!customer_phone || !PHONE_RE.test(String(customer_phone))) {
      return res.status(400).json({ success: false, message: "A valid customer_phone is required" });
    }
    if (customer_email && !EMAIL_RE.test(String(customer_email))) {
      return res.status(400).json({ success: false, message: "customer_email is not a valid email" });
    }

    // --- validate items ---
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "items must be a non-empty array" });
    }
    for (const item of items) {
      const listingId = Number(item.listing_id);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(listingId) || listingId < 1) {
        return res.status(400).json({ success: false, message: "Each item needs a valid listing_id" });
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
        return res.status(400).json({
          success: false,
          message: `quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}`,
        });
      }
    }
    const listingIds = items.map((item) => item.listing_id);
    if (new Set(listingIds).size !== listingIds.length) {
      return res.status(400).json({ success: false, message: "Duplicate listing_id in items" });
    }

    // --- optional login: use the cookie, with a Bearer fallback for testing ---
    let userId = null;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;
    const token = req.cookies?.token || bearerToken;

    if (token || authHeader) {
      if (!req.cookies?.token && authHeader && !bearerToken) {
        return res.status(401).json({ success: false, message: "Invalid authorization header" });
      }
      try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        userId = decoded.id; // logged-in customer order
      } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }
    }
    // No header at all -> guest order (userId stays null)

    // All the safe work (lock, stock check, DB prices, pickup code) happens
    // in the shared transaction function.
    const order = await placeOrder({
      userId,
      customerName: String(customer_name).trim(),
      customerPhone: String(customer_phone).trim(),
      customerEmail: customer_email ? String(customer_email).trim() : null,
      items: items.map((item) => ({ listingId: Number(item.listing_id), quantity: Number(item.quantity) })),
    });

    return res.status(201).json({ success: true, message: "Order placed", order });
  } catch (error) {
    next(error);
  }
}

// GET /api/orders/pickup/:code - public status check by pickup code
async function getOrderByPickupCode(req, res, next) {
  try {
    const code = String(req.params.code || "").trim().toUpperCase();
    if (code === "") {
      return res.status(400).json({ success: false, message: "Pickup code is required" });
    }

    const result = await pool.query(
      `SELECT
         o.id, o.pickup_code, o.status, o.total_price, o.created_at,
         o.customer_name, o.customer_phone,
         COALESCE(
           json_agg(
             json_build_object(
               'product_name', p.name,
               'quantity', oi.quantity,
               'price_at_purchase', oi.price_at_purchase,
               'line_total', oi.quantity * oi.price_at_purchase,
               'bakery_name', b.name,
               'bakery_address', b.address
             )
             ORDER BY oi.id
           ),
           '[]'::json
         ) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN listings l ON l.id = oi.listing_id
       JOIN products p ON p.id = l.product_id
       JOIN bakeries b ON b.id = p.bakery_id
       WHERE o.pickup_code = $1
       GROUP BY o.id`,
      [code]
    );

    const order = result.rows[0];
    if (!order) {
      return res.status(404).json({ success: false, message: "No order found for this pickup code" });
    }

    // No-shows: tell the customer clearly why nothing can be collected
    if (order.status === "expired") {
      return res.status(200).json({
        success: true,
        message: "This order has expired",
        order: {
          pickup_code: order.pickup_code,
          status: order.status,
          total_price: order.total_price,
          created_at: order.created_at,
        },
      });
    }

    // Hide private details: first name only + last 4 digits of the phone
    const firstName = String(order.customer_name).trim().split(/\s+/)[0];
    const maskedPhone = `******${String(order.customer_phone).slice(-4)}`;

    return res.status(200).json({
      success: true,
      order: {
        pickup_code: order.pickup_code,
        status: order.status,
        total_price: order.total_price,
        created_at: order.created_at,
        customer_first_name: firstName,
        customer_phone_masked: maskedPhone,
        items: order.items,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { placeCustomerOrder, getOrderByPickupCode };
