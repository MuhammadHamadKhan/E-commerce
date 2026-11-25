const multer = require("multer");
const ApiError = require("../utils/ApiError");

// Memory storage: the file stays in RAM as a Buffer and is never
// written to disk on this computer.
const upload = multer({
  storage: multer.memoryStorage(),

  // Hard limit: 2 MB
  limits: { fileSize: 2 * 1024 * 1024 },

  // Only real image types are accepted, everything else -> 400
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      cb(new ApiError(400, "Only JPEG, PNG or WebP images are allowed"));
    } else {
      cb(null, true);
    }
  },
});

// The form field name must be "image".
// Multer errors are translated here so the normal error middleware
// receives clean ApiErrors (400 bad file, 413 too large).
function uploadProductImage(req, res, next) {
  upload.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(413, "Image must be 2 MB or smaller"));
    }
    if (error) {
      return next(error); // ApiError from fileFilter, or anything unexpected
    }
    next(); // no file or a valid file
  });
}

module.exports = uploadProductImage;
