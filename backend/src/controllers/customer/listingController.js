const pool = require("../../config/db");

// Conditions every "active" listing must satisfy (shared by queries)
const ACTIVE_SQL = "l.available_from <= NOW() AND l.quantity_left > 0";

// Whitelist of allowed sort options, mapped to real SQL
const SORTS = {
  price_asc: "l.discounted_price ASC",
  price_desc: "l.discounted_price DESC",
  ending_soon: "l.expires_at ASC",
  biggest_discount: "(p.original_price - l.discounted_price) / p.original_price DESC",
};

// Positive integer with a maximum, or a fallback. Used for page/limit.
function toPageInt(value, { min = 1, max = 50, fallback }) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return fallback;
  return n;
}

// SELECT list shared by "all listings" and "one listing"
const LISTING_FIELDS = `
  l.id,
  p.name AS product_name,
  p.description,
  p.image_url,
  b.id AS bakery_id,
  b.name AS bakery_name,
  b.city,
  p.original_price,
  l.discounted_price,
  ROUND((p.original_price - l.discounted_price) / p.original_price * 100, 1) AS discount_percent,
  l.quantity_left,
  l.expires_at`;

// Shared FROM + WHERE for active listings
function activeListingsFrom(extraWhere, values) {
  return pool.query(
    `SELECT ${LISTING_FIELDS}
     FROM listings l
     JOIN products p ON p.id = l.product_id
     JOIN bakeries b ON b.id = p.bakery_id
     WHERE ${ACTIVE_SQL} ${extraWhere}`,
    values
  );
}

// GET /api/listings - public feed with filters, sorting and paging
async function getActiveListings(req, res, next) {
  try {
    const { city, search } = req.query;

    // Sort must be one of the known options
    const sort = req.query.sort || "ending_soon";
    if (!SORTS[sort]) {
      return res.status(400).json({
        success: false,
        message: "sort must be price_asc, price_desc, ending_soon or biggest_discount",
      });
    }

    // Paging (sane limits so nobody asks for 10,000 rows)
    const limit = toPageInt(req.query.limit, { min: 1, max: 50, fallback: 12 });
    const page = toPageInt(req.query.page, { min: 1, max: 1000, fallback: 1 });

    // Optional filters
    const where = [];
    const values = [];

    if (city) {
      values.push(city);
      where.push(`b.city ILIKE $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      where.push(`(p.name ILIKE $${values.length} OR b.name ILIKE $${values.length})`);
    }

    // Total count first (same filters, no paging)
    const count = await pool.query(
      `SELECT COUNT(*) AS total
       FROM listings l
       JOIN products p ON p.id = l.product_id
       JOIN bakeries b ON b.id = p.bakery_id
       WHERE ${ACTIVE_SQL} ${where.length ? "AND " + where.join(" AND ") : ""}`,
      values
    );

    // Then the page of results
    values.push(limit, (page - 1) * limit);
    const result = await pool.query(
      `SELECT ${LISTING_FIELDS}
       FROM listings l
       JOIN products p ON p.id = l.product_id
       JOIN bakeries b ON b.id = p.bakery_id
       WHERE ${ACTIVE_SQL} ${where.length ? "AND " + where.join(" AND ") : ""}
       ORDER BY ${SORTS[sort]}
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return res.status(200).json({
      success: true,
      total: Number(count.rows[0].total),
      page,
      limit,
      listings: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/listings/:id - one active listing (404 if gone/expired)
async function getActiveListing(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "Invalid listing id" });
    }

    const result = await activeListingsFrom("AND l.id = $1", [id]);

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Listing not found or no longer active" });
    }

    return res.status(200).json({ success: true, listing: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getActiveListings, getActiveListing };
