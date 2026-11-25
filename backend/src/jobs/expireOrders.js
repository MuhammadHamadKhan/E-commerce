const cron = require("node-cron");
const pool = require("../config/db");

// Mark orders as "expired" when the customer never picked them up:
// an order qualifies when EVERY listing in it has already expired
// (i.e. no item's listing is still valid).
// Quantities are NOT returned to stock, because the items expired anyway.
async function runExpireOrders() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE orders o
       SET status = 'expired'
       WHERE o.status IN ('pending', 'confirmed')
         AND NOT EXISTS (
           SELECT 1
           FROM order_items oi
           JOIN listings l ON l.id = oi.listing_id
           WHERE oi.order_id = o.id
             AND l.expires_at > NOW()          -- at least one item still valid
         )
       RETURNING o.id`
    );

    await client.query("COMMIT");

    // Log only when something actually changed
    if (result.rowCount > 0) {
      console.log(`[jobs] Expired ${result.rowCount} orders`);
    }
  } catch (error) {
    // Never let the job crash the server: log and continue
    await client.query("ROLLBACK").catch(() => {});
    console.error("[jobs] expireOrders failed:", error.message);
  } finally {
    client.release();
  }
}

// Run every 10 minutes
function startExpireOrders() {
  cron.schedule("*/10 * * * *", () => {
    runExpireOrders();
  });
  console.log("[jobs] expireOrders scheduled (every 10 minutes)");
}

module.exports = { startExpireOrders, runExpireOrders };
