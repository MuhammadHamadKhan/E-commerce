const pool = require("../../config/db");

// GET /api/bakery/profile - my bakery details
async function getMyProfile(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, owner_id, name, address, city, phone, created_at
       FROM bakeries
       WHERE id = $1`,
      [req.user.bakeryId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Bakery not found" });
    }

    return res.status(200).json({ success: true, bakery: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// PUT /api/bakery/profile - update name, address, city, phone
async function updateMyProfile(req, res, next) {
  try {
    const { name, address, city, phone } = req.body;

    // All four fields are required for a profile update
    for (const [field, value] of Object.entries({ name, address, city, phone })) {
      if (!value || String(value).trim() === "") {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const result = await pool.query(
      `UPDATE bakeries
       SET name = $1, address = $2, city = $3, phone = $4
       WHERE id = $5
       RETURNING id, owner_id, name, address, city, phone, created_at`,
      [String(name).trim(), String(address).trim(), String(city).trim(), String(phone).trim(), req.user.bakeryId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: "Bakery not found" });
    }

    return res.status(200).json({ success: true, message: "Profile updated", bakery: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMyProfile, updateMyProfile };
