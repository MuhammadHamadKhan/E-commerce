const pool = require("../../config/db");

// Same availability rules as the customer listings feed.
const ACTIVE_SQL = "l.available_from <= NOW() AND l.quantity_left > 0";

// GET /api/bakeries - all registered bakeries (paginated)
// Optional ?search= matches bakery name or city (partial, case-insensitive).
// Optional ?city= filters by city only.
async function getBakeries(req, res, next) {
  try {
    const values = [];
    const wheres = [];

    if (req.query.city) {
      values.push(req.query.city);
      wheres.push(`b.city ILIKE $${values.length}`);
    }

    if (req.query.search) {
      values.push(`%${req.query.search}%`);
      wheres.push(
        `(b.name ILIKE $${values.length} OR b.city ILIKE $${values.length})`
      );
    }

    const where = wheres.length ? "WHERE " + wheres.join(" AND ") : "";

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM bakeries b
       ${where}`,
      values
    );
    const total = Number(countResult.rows[0].total);

    const result = await pool.query(
      `SELECT b.id, b.name, b.address, b.city, b.phone
       FROM bakeries b
       ${where}
       ORDER BY b.name
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );

    // Only public fields: never owner email or password data
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      total,
      page,
      limit,
      bakeries: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bakeries/:id - one bakery plus its active listings
async function getBakeryDetails(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "Invalid bakery id" });
    }

    const bakery = await pool.query(
      `SELECT id, name, address, city, phone
       FROM bakeries
       WHERE id = $1`,
      [id]
    );

    if (!bakery.rows[0]) {
      return res.status(404).json({ success: false, message: "Bakery not found" });
    }

    const listings = await pool.query(
      `SELECT
         l.id,
         p.name AS product_name,
         p.description,
         p.image_url,
         p.original_price,
         l.discounted_price,
         ROUND((p.original_price - l.discounted_price) / p.original_price * 100, 1) AS discount_percent,
         l.quantity_left,
         l.expires_at
       FROM listings l
       JOIN products p ON p.id = l.product_id
       WHERE p.bakery_id = $1 AND ${ACTIVE_SQL}
       ORDER BY l.expires_at ASC`,
      [id]
    );

    return res.status(200).json({
      success: true,
      bakery: bakery.rows[0],
      active_listings: listings.rows,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getBakeries, getBakeryDetails };
