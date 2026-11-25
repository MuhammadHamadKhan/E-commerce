const pool = require("../../config/db");
const { uploadImage, deleteImage } = require("../../utils/cloudinaryUpload");

// Turns a request param into a positive integer id, or null if invalid.
function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Returns a positive number, or null if invalid.
function toPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// POST /api/bakery/products - add a product to MY bakery (image optional)
async function createProduct(req, res, next) {
  const { name, description, image_url, original_price } = req.body;
  let uploaded = null; // remember an uploaded image so we can clean up on failure

  try {
    if (!name || String(name).trim() === "") {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }
    const price = toPositiveNumber(original_price);
    if (price === null) {
      return res.status(400).json({ success: false, message: "original_price must be a positive number" });
    }

    // Upload the optional image (multipart field "image")
    if (req.file) {
      uploaded = await uploadImage(req.file.buffer);
    }

    // bakery_id comes from the token, never from the body
    const result = await pool.query(
      `INSERT INTO products (bakery_id, name, description, image_url, image_public_id, original_price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.bakeryId,
        String(name).trim(),
        description || null,
        uploaded ? uploaded.url : image_url || null, // uploaded file wins over a manual URL
        uploaded ? uploaded.publicId : null,
        price,
      ]
    );

    return res.status(201).json({ success: true, message: "Product created", product: result.rows[0] });
  } catch (error) {
    // Database save failed after upload: remove the image so no orphans are left
    if (uploaded) await deleteImage(uploaded.publicId);
    next(error);
  }
}

// GET /api/bakery/products - all products of MY bakery
async function getMyProducts(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE bakery_id = $1 ORDER BY created_at DESC`,
      [req.user.bakeryId]
    );

    return res.status(200).json({ success: true, count: result.rows.length, products: result.rows });
  } catch (error) {
    next(error);
  }
}

// GET /api/bakery/products/:id - one of MY products (404 if not mine)
async function getMyProduct(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const result = await pool.query(
      `SELECT * FROM products WHERE id = $1 AND bakery_id = $2`,
      [id, req.user.bakeryId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// PUT /api/bakery/products/:id - edit MY product (image optional)
// Columns allowed to change are fixed here, so the client cannot touch bakery_id.
const EDITABLE_PRODUCT_FIELDS = {
  name: "name",
  description: "description",
  image_url: "image_url",
  original_price: "original_price",
};

async function updateMyProduct(req, res, next) {
  const id = toId(req.params.id);
  let uploaded = null;

  try {
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    // Load MY product first: we need the old image id in case it gets replaced
    const existing = await pool.query(
      `SELECT * FROM products WHERE id = $1 AND bakery_id = $2`,
      [id, req.user.bakeryId]
    );
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const product = existing.rows[0];

    // Build "col = $n" pairs only for fields the client actually sent
    const setParts = [];
    const values = [];

    for (const [bodyKey, column] of Object.entries(EDITABLE_PRODUCT_FIELDS)) {
      if (req.body[bodyKey] === undefined) continue;

      if (bodyKey === "name") {
        if (String(req.body.name).trim() === "") {
          return res.status(400).json({ success: false, message: "Product name cannot be empty" });
        }
        values.push(String(req.body.name).trim());
      } else if (bodyKey === "original_price") {
        const price = toPositiveNumber(req.body.original_price);
        if (price === null) {
          return res.status(400).json({ success: false, message: "original_price must be a positive number" });
        }
        values.push(price);
      } else {
        values.push(req.body[bodyKey]);
      }

      setParts.push(`${column} = $${values.length}`);
    }

    // A new uploaded image replaces the old one
    if (req.file) {
      uploaded = await uploadImage(req.file.buffer);
      values.push(uploaded.url, uploaded.publicId);
      setParts.push(`image_url = $${values.length - 1}`, `image_public_id = $${values.length}`);
    }

    if (setParts.length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    values.push(id, req.user.bakeryId);

    const result = await pool.query(
      `UPDATE products SET ${setParts.join(", ")}
       WHERE id = $${values.length - 1} AND bakery_id = $${values.length}
       RETURNING *`,
      values
    );

    if (!result.rows[0]) {
      // Should not happen (we checked above), but treat it as not found
      if (uploaded) await deleteImage(uploaded.publicId);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Success: the old image is no longer referenced, remove it from Cloudinary
    if (uploaded && product.image_public_id) {
      await deleteImage(product.image_public_id);
    }

    return res.status(200).json({ success: true, message: "Product updated", product: result.rows[0] });
  } catch (error) {
    // Database save failed after upload: remove the new image, keep the old one
    if (uploaded) await deleteImage(uploaded.publicId);
    next(error);
  }
}

// DELETE /api/bakery/products/:id - delete MY product (and its image)
async function deleteMyProduct(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    // Listings block deletion first (keep the message clear for the owner)
    const listings = await pool.query(
      `SELECT 1 FROM listings WHERE product_id = $1 LIMIT 1`,
      [id]
    );
    if (listings.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete: this product has listings. Delete its listings first.",
      });
    }

    try {
      const result = await pool.query(
        `DELETE FROM products WHERE id = $1 AND bakery_id = $2
         RETURNING id, image_public_id`,
        [id, req.user.bakeryId]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      // Product row is gone: its image is no longer needed in Cloudinary
      await deleteImage(result.rows[0].image_public_id);

      return res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
      // 23503 = foreign key violation: order_items still reference this product
      if (error.code === "23503") {
        return res.status(409).json({
          success: false,
          message: "Cannot delete: orders exist for this product.",
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProduct,
  getMyProducts,
  getMyProduct,
  updateMyProduct,
  deleteMyProduct,
};
