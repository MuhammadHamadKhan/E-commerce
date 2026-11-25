const pool = require("../../config/db");

// Same "active" rules as the customer listings feed
const ACTIVE_SQL = "l.available_from <= NOW() AND l.quantity_left > 0";

// Fields selected for every listing row
const LISTING_FIELDS = `
  l.id,
  p.name AS product_name,
  p.description,
  p.image_url,
  p.original_price,
  l.discounted_price,
  ROUND((p.original_price - l.discounted_price) / p.original_price * 100, 1) AS discount_percent,
  l.quantity_left,
  l.expires_at
`;

// Pick only the listing-shaped fields from a joined row (keeps bakery info
// so cards can show which bakery the deal belongs to, like the /listings feed).
function toListing(row) {
  return {
    id: row.id,
    product_name: row.product_name,
    description: row.description,
    image_url: row.image_url,
    bakery_id: row.bakery_id,
    bakery_name: row.bakery_name,
    city: row.city,
    original_price: row.original_price,
    discounted_price: row.discounted_price,
    discount_percent: row.discount_percent,
    quantity_left: row.quantity_left,
    expires_at: row.expires_at,
  };
}

// Builds a search WHERE clause + values when a search term is given.
// Matches product name or bakery name (case-insensitive, partial).
function searchWhere(search) {
  if (!search || !search.trim()) {
    return { where: "", values: [] };
  }
  const term = `%${search.trim()}%`;
  return {
    where: `AND (p.name ILIKE $1 OR b.name ILIKE $2)`,
    values: [term, term],
  };
}

// GET /api/browse - discovery page: urgency sections + bakery-grouped catalog.
// Optional ?search= filters every section by product or bakery name.
async function getBrowse(req, res, next) {
  try {
    const search = req.query.search;
    const { where, values } = searchWhere(search);

    // 1) Ending soon: active listings expiring within the next 6 hours
    const endingSoon = await pool.query(
      `SELECT ${LISTING_FIELDS}, b.id AS bakery_id, b.name AS bakery_name, b.city
       FROM listings l
       JOIN products p ON p.id = l.product_id
       JOIN bakeries b ON b.id = p.bakery_id
       WHERE ${ACTIVE_SQL} ${where}
         AND l.expires_at <= NOW() + INTERVAL '6 hours'
       ORDER BY l.expires_at ASC
       LIMIT 12`,
      values
    );

    // 2) Biggest discounts: top active listings by discount percentage
    const biggestDiscounts = await pool.query(
      `SELECT ${LISTING_FIELDS}, b.id AS bakery_id, b.name AS bakery_name, b.city
       FROM listings l
       JOIN products p ON p.id = l.product_id
       JOIN bakeries b ON b.id = p.bakery_id
       WHERE ${ACTIVE_SQL} ${where}
       ORDER BY discount_percent DESC
       LIMIT 8`,
      values
    );

    // 3) All active listings with bakery info, grouped by bakery in JS
    //    (single query, no N+1)
    const allListings = await pool.query(
      `SELECT ${LISTING_FIELDS}, b.id AS bakery_id, b.name AS bakery_name,
              b.address, b.city, b.phone
       FROM listings l
       JOIN products p ON p.id = l.product_id
       JOIN bakeries b ON b.id = p.bakery_id
       WHERE ${ACTIVE_SQL} ${where}
       ORDER BY b.name, l.expires_at ASC`,
      values
    );

    const bakeryMap = new Map();
    for (const row of allListings.rows) {
      const { bakery_id, bakery_name, address, city, phone } = row;
      if (!bakeryMap.has(bakery_id)) {
        bakeryMap.set(bakery_id, {
          id: bakery_id,
          name: bakery_name,
          address,
          city,
          phone,
          active_listing_count: 0,
          listings: [],
        });
      }
      const bakery = bakeryMap.get(bakery_id);
      bakery.active_listing_count += 1;
      bakery.listings.push(toListing(row));
    }

    const bakeries = Array.from(bakeryMap.values());

    return res.status(200).json({
      success: true,
      search: search || "",
      sections: {
        ending_soon: endingSoon.rows.map(toListing),
        biggest_discounts: biggestDiscounts.rows.map(toListing),
        bakeries,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getBrowse };
