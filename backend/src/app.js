const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const bakeryAuthRoutes = require("./routes/auth/bakeryAuthRoutes");
const bakeryRoutes = require("./routes/bakery");
const customerRoutes = require("./routes/customer");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { generalApiLimiter } = require("./middleware/rateLimiters");
const requireApiContentType = require("./middleware/requireApiContentType");
const { clientUrl } = require("./config");

const app = express();

// Security headers (XSS, sniffing, frame protection, etc.)
app.use(helmet());

// Only the frontend origin may use browser API requests; cookies need credentials.
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

// Body parsers with a small size limit so nobody can send huge payloads
app.use(cookieParser());
app.set("clientUrl", clientUrl);
app.use("/api", requireApiContentType);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// General rate limit for every /api route
app.use("/api", generalApiLimiter);

// Health check (useful for uptime monitors / load balancers)
app.get("/health", (req, res) => {
  res.json({ success: true, message: "OK" });
});

// Auth routes
app.use("/api/auth/bakery", bakeryAuthRoutes);

// Bakery owner routes (products, listings, orders, profile)
app.use("/api/bakery", bakeryRoutes);

// Public customer routes (no login required)
app.use("/api", customerRoutes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
