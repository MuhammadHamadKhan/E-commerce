const bcrypt = require("bcryptjs");
const pool = require("../../config/db");
const generateToken = require("../../utils/generateToken");
const { setAuthCookie, clearAuthCookie } = require("../../utils/authCookie");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/bakery/register
// Create user + bakery in ONE transaction. Never return password/hash.
async function registerBakery(req, res, next) {
  const { owner_name, email, password, phone, bakery_name, address, city } = req.body;

  try {
    // Basic validation
    if (!owner_name || !email || !password || !phone || !bakery_name || !address || !city) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // Hash password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Use a transaction so user + bakery are created together or not at all
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1) Create bakery owner
      const userResult = await client.query(
        `INSERT INTO users (name, email, password_hash, phone, role)
         VALUES ($1, $2, $3, $4, 'bakery_owner')
         RETURNING id, name, email, phone, role, created_at`,
        [owner_name, email, passwordHash, phone]
      );
      const user = userResult.rows[0];

      // 2) Create bakery linked to the owner
      const bakeryResult = await client.query(
        `INSERT INTO bakeries (owner_id, name, address, city, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, owner_id, name, address, city, phone, created_at`,
        [user.id, bakery_name, address, city, phone]
      );
      const bakery = bakeryResult.rows[0];

      await client.query("COMMIT");

      // Keep the token out of JavaScript and send it as a cookie.
      const token = generateToken(user);
      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        message: "Bakery registered successfully",
        user,
        bakery,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/bakery/login
async function loginBakery(req, res, next) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Find user with this email
    const userResult = await pool.query(
      `SELECT id, name, email, password_hash, phone, role, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = userResult.rows[0];

    // Same generic message for wrong email or wrong password
    if (!user || user.role !== "bakery_owner") {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    } 

    // Get bakery info for this owner
    const bakeryResult = await pool.query(
     `SELECT id, owner_id, name, address, city, phone, created_at
       FROM bakeries
       WHERE owner_id = $1
       LIMIT 1`,
      [user.id]
    );
    const bakery = bakeryResult.rows[0] || null;

    // Never expose password_hash
    delete user.password_hash;

    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      bakery,
    });
  } catch (error) {
    next(error);
  }
}

function logoutBakery(req, res) {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, message: "Logout successful" });
}

// GET /api/auth/bakery/me (protected)
async function getCurrentBakeryOwner(req, res, next) {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      `SELECT id, name, email, phone, role, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );
    const user = userResult.rows[0];

    if (!user || user.role !== "bakery_owner") {
      return res.status(403).json({ success: false, message: "Bakery owner access only" });
    }

    const bakeryResult = await pool.query(
      `SELECT id, owner_id, name, address, city, phone, created_at
       FROM bakeries
       WHERE owner_id = $1
       LIMIT 1`,
      [userId]
    );
    const bakery = bakeryResult.rows[0] || null;

    return res.status(200).json({
      success: true,
      user,
      bakery,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerBakery,
  loginBakery,
  logoutBakery,
  getCurrentBakeryOwner,
};
