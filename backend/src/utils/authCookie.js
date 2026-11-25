const jwt = require("jsonwebtoken");
const { nodeEnv } = require("../config");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: nodeEnv === "production",
  path: "/",
};

function setAuthCookie(res, token) {
  const payload = jwt.decode(token);
  if (!payload || typeof payload !== "object" || typeof payload.exp !== "number") {
    throw new Error("Cannot set an auth cookie without a token expiry");
  }

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: payload.exp * 1000 - Date.now(),
  });
}

function clearAuthCookie(res) {
  res.clearCookie("token", cookieOptions);
}

module.exports = { setAuthCookie, clearAuthCookie };
