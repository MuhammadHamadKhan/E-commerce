const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config");

// Create a signed JWT for a user.
// We only put safe, non-sensitive info in the token.
function generateToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}

module.exports = generateToken;
