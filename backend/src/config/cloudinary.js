const { v2: cloudinary } = require("cloudinary");

// The SDK reads CLOUDINARY_URL from the environment automatically.
// We only turn on https URLs. The secret is never printed anywhere.
cloudinary.config(); // load credentials from CLOUDINARY_URL
cloudinary.config({ secure: true });

module.exports = cloudinary;
