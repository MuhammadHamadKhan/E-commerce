const cloudinary = require("../config/cloudinary");
const ApiError = require("./ApiError");

const FOLDER = "bakery-leftovers/products";

// Convert any Cloudinary failure into one clean ApiError.
// Details go to the server log only; the secret is never printed.
function toUploadError(error) {
  console.error("Cloudinary real error:", error);
  console.error("[cloudinary] upload failed:", error?.message || error);
  return new ApiError(500, "Image upload failed, please try again");
}

// Upload a Buffer to Cloudinary and return { url, publicId }.
// Large images are shrunk (max width 1000px) and Cloudinary picks
// the best quality and format automatically.
function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    let stream;

    try {
      // Cloudinary can throw here (e.g. missing credentials)
      stream = cloudinary.uploader.upload_stream(
        {
          folder: FOLDER,
          transformation: [
            { width: 1000, crop: "limit" }, // never wider than 1000px
            { quality: "auto" },            // automatic quality
            { fetch_format: "auto" },       // automatic format (webp etc.)
          ],
        },
        (error, result) => {
          if (error || !result) {
            return reject(toUploadError(error));
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
    } catch (error) {
      return reject(toUploadError(error));
    }

    // Pipe the in-memory file into the upload stream
    stream.end(buffer);
  });
}

// Delete an image from Cloudinary by its public_id.
// Used when a product image is replaced or the product is deleted.
async function deleteImage(publicId) {
  if (!publicId) return; // nothing stored, nothing to do

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Not fatal for the request: just log so we can clean up later
    console.error("[cloudinary] delete failed:", error.message);
  }
}

module.exports = { uploadImage, deleteImage };
