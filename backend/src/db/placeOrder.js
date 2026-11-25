// Example order placement using a PostgreSQL transaction.
//
// Run from the backend folder after loading .env:
//   const { placeOrder } = require("./db/placeOrder");
//   await placeOrder({
//     customerName: "Ali Raza",
//     customerPhone: "0300-1234567",
//     customerEmail: "ali@example.com",     // optional
//     userId: null,                         // null = guest order
//     items: [{ listingId: 1, quantity: 2 }],
//   });

const crypto = require("node:crypto");
const pool = require("../config/db");

// No 0/O or 1/I so a code is easy to read out loud at the counter.
const PICKUP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePickupCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += PICKUP_ALPHABET[crypto.randomInt(PICKUP_ALPHABET.length)];
  }
  return code;
}

async function placeOrder({
  userId = null,
  customerName,
  customerPhone,
  customerEmail = null,
  items,
}) {
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock every listing row involved in this order, sorted by id.
    //    FOR UPDATE makes a second concurrent order wait here instead of
    //    reading the same quantity_left at the same time.
    //    (Sorted order also avoids deadlocks between two multi-item orders.)
    const listingIds = items.map((item) => item.listingId);

    const { rows: listings } = await client.query(
      `SELECT id, discounted_price, quantity_left, expires_at
       FROM listings
       WHERE id = ANY($1::int[])
       ORDER BY id
       FOR UPDATE`,
      [listingIds]
    );

    const byId = new Map(listings.map((listing) => [listing.id, listing]));

    // 2. Validate everything before writing anything. Prices come from the
    //    database, never from the customer.
    let total = 0;

    for (const item of items) {
      const listing = byId.get(item.listingId);

      if (!listing) {
        throw new Error(`Listing ${item.listingId} not found`);
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error(`Invalid quantity for listing ${item.listingId}`);
      }
      if (listing.quantity_left < item.quantity) {
        throw new Error(`Not enough stock for listing ${item.listingId}`);
      }

      total += Number(listing.discounted_price) * item.quantity;
    }

    // 3. Insert the order. If the random pickup code already exists,
    //    ON CONFLICT DO NOTHING returns no row, so we simply try another code.
    let order = null;

    for (let attempt = 0; attempt < 5 && !order; attempt++) {
      const { rows } = await client.query(
        `INSERT INTO orders
           (user_id, customer_name, customer_phone, customer_email, pickup_code, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (pickup_code) DO NOTHING
         RETURNING id, pickup_code, total_price, status, created_at`,
        [userId, customerName, customerPhone, customerEmail, generatePickupCode(), total.toFixed(2)]
      );

      order = rows[0] || null;
    }

    if (!order) {
      throw new Error("Could not generate a unique pickup code");
    }

    // 4. Save the order lines and take stock away from each listing.
    for (const item of items) {
      const listing = byId.get(item.listingId);

      await client.query(
        `INSERT INTO order_items (order_id, listing_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.listingId, item.quantity, listing.discounted_price]
      );

      // Second safety guard: the UPDATE only succeeds while enough stock
      // remains, so quantity_left can never become negative.
      const { rowCount } = await client.query(
        `UPDATE listings
         SET quantity_left = quantity_left - $1
         WHERE id = $2 AND quantity_left >= $1`,
        [item.quantity, item.listingId]
      );

      if (rowCount === 0) {
        throw new Error(`Not enough stock for listing ${item.listingId}`);
      }
    }

    // 5. Everything worked: save permanently.
    await client.query("COMMIT");
    return order;
  } catch (error) {
    // Any failure undoes the order, its items, and the stock changes.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Always return the connection to the pool.
    client.release();
  }
}

module.exports = { placeOrder, generatePickupCode };
