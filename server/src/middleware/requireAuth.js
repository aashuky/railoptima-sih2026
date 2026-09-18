const { verifyToken } = require("../services/jwt");
const ApiError = require("../utils/ApiError");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Authentication required."));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
}

module.exports = { requireAuth };
