const logger = require("../utils/logger");

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  // Never leak internal error messages/stack traces for unexpected (non-operational) errors.
  const message = err.isOperational ? err.message : "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(err.message, { stack: err.stack, path: req.originalUrl });
  } else {
    logger.warn(err.message, { path: req.originalUrl });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === "development" && statusCode >= 500 ? { stack: err.stack } : {})
  });
};
