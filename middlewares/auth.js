const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "").trim();

  if (token.split(".").length !== 3) {
    console.error("Malformed token received:", token);
    throw new UnauthorizedError("Invalid token format");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = auth;




