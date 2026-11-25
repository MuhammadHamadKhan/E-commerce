const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config");
const pool = require("../config/db");
const { clearAuthCookie } = require("../utils/authCookie");

// Read the browser cookie first; the header keeps command-line testing easy.
async function authMiddleware(req, res, next) {
  const authHeader = req.get("authorization") || "";
  const bearerToken = authHeader.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    clearAuthCookie(res);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.user = { id: decoded.id, role: decoded.role };

  try {
    const result = await pool.query(
      "SELECT id FROM bakeries WHERE owner_id = $1 LIMIT 1",
      [req.user.id]
    );
    if (result.rows[0]) req.user.bakeryId = result.rows[0].id;
    next();
  } catch (error) {
    next(error);
  }
}

// Helper for owner-only routes
function requireBakeryOwner(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (req.user.role !== "bakery_owner") {
    return res.status(403).json({ success: false, message: "Bakery owner access only" });
  }
  next();
}

module.exports = authMiddleware;
module.exports.requireBakeryOwner = requireBakeryOwner;
