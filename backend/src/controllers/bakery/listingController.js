const pool = require("../../config/db");

function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function toPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// A valid JavaScript Date, or null.
function toValidDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// POST /api/bakery/listings - offer one of MY products at a discount
async function createListing(req, res, next) {
  try {
    const { product_id, discounted_price, quantity_left, available_from, expires_at } = req.body;

    const productId = toId(product_id);
    if (productId === null) {
      return res.status(400).json({ success: false, message: "product_id must be a positive integer" });
    }

    const price = toPositiveNumber(discounted_price);
    if (price === null) {
      return res.status(400).json({ success: false, message: "discounted_price must be a positive number" });
    }

    const qty = Number(quantity_left);
    if (!Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: "quantity_left must be an integer of 0 or more" });
    }

    // The product must belong to MY bakery
    const product = await pool.query(
      `SELECT id, original_price FROM products WHERE id = $1 AND bakery_id = $2`,
      [productId, req.user.bakeryId]
    );
    if (!product.rows[0]) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Discount must be lower than the product's own price
    if (price >= Number(product.rows[0].original_price)) {
      return res.status(400).json({
        success: false,
        message: `discounted_price must be lower than the product price (${product.rows[0].original_price})`,
      });
    }

    const from = available_from ? toValidDate(available_from) : new Date();
    if (from === null) {
      return res.status(400).json({ success: false, message: "available_from must be a valid date" });
    }

    const until = toValidDate(expires_at);
    if (until === null) {
      return res.status(400).json({ success: false, message: "expires_at must be a valid date" });
    }
    if (until <= new Date()) {
      return res.status(400).json({ success: false, message: "expires_at must be in the future" });
    }
    if (until <= from) {
      return res.status(400).json({ success: false, message: "expires_at must be after available_from" });
    }

    const result = await pool.query(
      `INSERT INTO listings (product_id, discounted_price, quantity_left, available_from, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [productId, price, qty, from, until]
    );

    return res.status(201).json({ success: true, message: "Listing created", listing: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// GET /api/bakery/listings - my listings, optional ?status=active|expired|soldout
async function getMyListings(req, res, next) {
  try {
    const status = req.query.status;

    let where = "p.bakery_id = $1";
    const values = [req.user.bakeryId];

    if (status === "active") {
      where += " AND l.available_from <= NOW() AND l.quantity_left > 0";
    } else if (status === "expired") {
      where += " AND l.quantity_left = 0 AND l.available_from <= NOW()";
    } else if (status === "soldout") {
      where += " AND l.quantity_left = 0";
    } else if (status) {
      return res.status(400).json({ success: false, message: "status must be active, expired or soldout" });
    }

    const result = await pool.query(
      `SELECT
         l.id,
         l.product_id,
         p.name AS product_name,
         p.original_price,
         l.discounted_price,
         ROUND((p.original_price - l.discounted_price) / p.original_price * 100, 1) AS discount_percent,
         l.quantity_left,
         l.available_from,
         l.expires_at,
         l.created_at
       FROM listings l
       JOIN products p ON p.id = l.product_id
       WHERE ${where}
       ORDER BY l.created_at DESC`,
      values
    );

    return res.status(200).json({ success: true, count: result.rows.length, listings: result.rows });
  } catch (error) {
    next(error);
  }
}

// PUT /api/bakery/listings/:id - edit MY listing (price, quantity, times)
async function updateMyListing(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid listing id" });
    }

    // Load my listing together with its product price (ownership check included)
    const existing = await pool.query(
      `SELECT l.id, l.discounted_price, l.quantity_left, l.available_from, l.expires_at, p.original_price
       FROM listings l
       JOIN products p ON p.id = l.product_id
       WHERE l.id = $1 AND p.bakery_id = $2`,
      [id, req.user.bakeryId]
    );
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    const listing = existing.rows[0];

    // Collect the new values, falling back to the current ones
    let price = listing.discounted_price;
    let qty = listing.quantity_left;
    let from = listing.available_from;
    let until = listing.expires_at;

    if (req.body.discounted_price !== undefined) {
      price = toPositiveNumber(req.body.discounted_price);
      if (price === null) {
        return res.status(400).json({ success: false, message: "discounted_price must be a positive number" });
      }
    }
    if (req.body.quantity_left !== undefined) {
      qty = Number(req.body.quantity_left);
      if (!Number.isInteger(qty) || qty < 0) {
        return res.status(400).json({ success: false, message: "quantity_left must be an integer of 0 or more" });
      }
    }
    if (req.body.available_from !== undefined) {
      from = toValidDate(req.body.available_from);
      if (from === null) {
        return res.status(400).json({ success: false, message: "available_from must be a valid date" });
      }
    }
    if (req.body.expires_at !== undefined) {
      until = toValidDate(req.body.expires_at);
      if (until === null) {
        return res.status(400).json({ success: false, message: "expires_at must be a valid date" });
      }
      if (until <= new Date()) {
        return res.status(400).json({ success: false, message: "expires_at must be in the future" });
      }
    }

    if (price >= Number(listing.original_price)) {
      return res.status(400).json({
        success: false,
        message: `discounted_price must be lower than the product price (${listing.original_price})`,
      });
    }
    if (until <= from) {
      return res.status(400).json({ success: false, message: "expires_at must be after available_from" });
    }

    const result = await pool.query(
      `UPDATE listings
       SET discounted_price = $1, quantity_left = $2, available_from = $3, expires_at = $4
       WHERE id = $5
       RETURNING *`,
      [price, qty, from, until, id]
    );

    return res.status(200).json({ success: true, message: "Listing updated", listing: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/bakery/listings/:id - delete MY listing
async function deleteMyListing(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid listing id" });
    }

    // Ownership is checked in the same query: only my listing can be deleted
    const result = await pool.query(
      `DELETE FROM listings l
       USING products p
       WHERE l.product_id = p.id AND l.id = $1 AND p.bakery_id = $2
       RETURNING l.id`,
      [id, req.user.bakeryId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    return res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createListing,
  getMyListings,
  updateMyListing,
  deleteMyListing,
};
