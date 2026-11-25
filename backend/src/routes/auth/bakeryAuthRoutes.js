const { Router } = require("express");
const { registerBakery, loginBakery, logoutBakery, getCurrentBakeryOwner } = require("../../controllers/auth/bakeryAuthController");
const authMiddleware = require("../../middleware/authMiddleware");
const { authLimiter } = require("../../middleware/rateLimiters");

const router = Router();

// Public routes, protected against brute force by the auth limiter
router.post("/register", authLimiter, registerBakery);
router.post("/login", authLimiter, loginBakery);
router.post("/logout", logoutBakery);

// Protected route
router.get("/me", authMiddleware, getCurrentBakeryOwner);

module.exports = router;
