const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ALLOWED_CONTENT_TYPES = new Set(["application/json", "multipart/form-data"]);

function requireApiContentType(req, res, next) {
  if (!MUTATION_METHODS.has(req.method)) return next();

  const contentType = (req.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return res.status(415).json({
      success: false,
      message: "Use application/json or multipart/form-data for changes",
    });
  }

  const origin = req.get("origin");
  if (origin && origin !== req.app.get("clientUrl")) {
    return res.status(403).json({ success: false, message: "Request origin is not allowed" });
  }

  // Lax cookies block cross-site form posts; JSON writes require CORS preflight.
  // Multipart is needed for uploads, so browser writes also check their origin.
  next();
}

module.exports = requireApiContentType;
