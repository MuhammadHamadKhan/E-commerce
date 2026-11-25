const rateLimit = require("express-rate-limit");

// Shared options: modern headers, no legacy X-RateLimit-* headers
const standardOptions = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
};

// General limiter for ALL /api routes: 100 requests / 15 min / IP
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  ...standardOptions,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Strict limiter for login + register: 10 attempts / 15 min / IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  ...standardOptions,
  message: { success: false, message: "Too many attempts, please try again later" },
});

// Order placing: 10 / 15 min / IP (prevents order spam)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  ...standardOptions,
  message: { success: false, message: "Too many orders from this IP, please try again later." },
});

// Pickup-code lookup: 30 / 15 min / IP (prevents code guessing)
const pickupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  ...standardOptions,
  message: { success: false, message: "Too many pickup code lookups, please try again later." },
});

module.exports = { generalApiLimiter, authLimiter, orderLimiter, pickupLimiter };
