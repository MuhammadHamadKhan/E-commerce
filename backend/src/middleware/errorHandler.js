const { nodeEnv } = require("../config");

// Express recognizes error middleware by its 4 arguments.
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = nodeEnv === "development";

  // In production never leak internals: generic message for 500s,
  // and never a stack trace.
  let message = err.message || "Internal server error";
  if (!isDev && statusCode >= 500) {
    message = "Internal server error";
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }), // full details only in development
  });
};
