const ApiError = require("../utils/ApiError");

// Temporary in-memory data until a database is wired up.
const products = [
  { id: 1, name: "Sample Product", price: 19.99 },
];

exports.getAll = (req, res) => {
  res.json({ success: true, data: products });
};

exports.getById = (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
 
  res.json({ success: true, data: product });
};
