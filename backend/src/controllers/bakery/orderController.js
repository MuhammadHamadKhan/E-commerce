const pool = require("../../config/db");

function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const VALID_ORDER_STATUSES = ["pending", "confirmed", "picked_up", "cancelled", "expired"];

// One order plus its items that belong to MY bakery.
// Shared by: list, get one, pickup-code lookup.
// The JOIN on products.bakery_id hides orders that have none of my items.
function ordersWithMyItemsQuery(whereSql, values) {
  return pool.query(
    `SELECT
       o.id,
       o.pickup_code,
       o.customer_name,
       o.customer_phone,
       o.customer_email,
       o.status,
       o.total_price,
       o.created_at,
       COALESCE(
         json_agg(
           json_build_object(
             'order_item_id', oi.id,
             'listing_id', oi.listing_id,
             'product_name', p.name,
             'quantity', oi.quantity,
             'price_at_purchase', oi.price_at_purchase
           )
           ORDER BY oi.id
         ),
         '[]'::json
       ) AS items
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN listings l ON l.id = oi.listing_id
     JOIN products p ON p.id = l.product_id
     WHERE ${whereSql}
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    values
  );
}

// GET /api/bakery/orders - orders containing my items, newest first
async function getMyOrders(req, res, next) {
  try {
    const status = req.query.status;

    let where = "p.bakery_id = $1";
    const values = [req.user.bakeryId];

    if (status) {
      if (!["pending", "confirmed", "picked_up", "cancelled", "expired"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "status must be pending, confirmed, picked_up, cancelled or expired",
        });
      }
      values.push(status);
      where += ` AND o.status = $${values.length}`;
    }

    const result = await ordersWithMyItemsQuery(where, values);

    return res.status(200).json({ success: true, count: result.rows.length, orders: result.rows });
  } catch (error) {
    next(error);
  }
}

// GET /api/bakery/orders/:id - one order, only if it contains my items
async function getMyOrder(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const result = await ordersWithMyItemsQuery("p.bakery_id = $1 AND o.id = $2", [
      req.user.bakeryId,
      id,
    ]);

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// GET /api/bakery/orders/pickup/:code - check a customer's code at the counter
async function getOrderByPickupCode(req, res, next) {
  try {
    const code = String(req.params.code || "").trim().toUpperCase();
    if (code === "") {
      return res.status(400).json({ success: false, message: "Pickup code is required" });
    }

    const result = await ordersWithMyItemsQuery("p.bakery_id = $1 AND o.pickup_code = $2", [
      req.user.bakeryId,
      code,
    ]);

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Order not found for this pickup code" });
    }

    return res.status(200).json({ success: true, order: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/bakery/orders/:id/status - move an order through its lifecycle
async function updateMyOrderStatus(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }

    const newStatus = req.body.status;
    if (!VALID_ORDER_STATUSES.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${VALID_ORDER_STATUSES.join(", ")}`,
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Lock the order so concurrent status changes cannot double-adjust stock.
      const existing = await client.query(
        `SELECT o.id, o.status
         FROM orders o
         JOIN order_items oi ON oi.order_id = o.id
         JOIN listings l ON l.id = oi.listing_id
         JOIN products p ON p.id = l.product_id
         WHERE o.id = $1 AND p.bakery_id = $2
         LIMIT 1
         FOR UPDATE OF o`,
        [id, req.user.bakeryId]
      );
      if (!existing.rows[0]) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      const currentStatus = existing.rows[0].status;

      if (currentStatus === "cancelled" && newStatus !== "cancelled") {
        const items = await client.query(
          `SELECT l.id, l.quantity_left, oi.quantity
           FROM order_items oi
           JOIN listings l ON l.id = oi.listing_id
           JOIN products p ON p.id = l.product_id
           WHERE oi.order_id = $1 AND p.bakery_id = $2
           ORDER BY l.id
           FOR UPDATE OF l`,
          [id, req.user.bakeryId]
        );

        if (items.rows.some((item) => item.quantity_left < item.quantity)) {
          await client.query("ROLLBACK");
          return res.status(409).json({
            success: false,
            message: "Cannot reopen this order because there is not enough stock.",
          });
        }

        for (const item of items.rows) {
          await client.query(
            `UPDATE listings SET quantity_left = quantity_left - $1 WHERE id = $2`,
            [item.quantity, item.id]
          );
        }
      } else if (currentStatus !== "cancelled" && newStatus === "cancelled") {
        await client.query(
          `UPDATE listings l
           SET quantity_left = l.quantity_left + oi.quantity
           FROM order_items oi
           WHERE oi.listing_id = l.id
             AND oi.order_id = $1
             AND l.product_id IN (SELECT id FROM products WHERE bakery_id = $2)`,
          [id, req.user.bakeryId]
        );
      }

      const update = await client.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status`,
        [newStatus, id]
      );

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: `Order status changed to ${newStatus}`,
        order: { id: update.rows[0].id, status: update.rows[0].status },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyOrders,
  getMyOrder,
  getOrderByPickupCode,
  updateMyOrderStatus,
};
