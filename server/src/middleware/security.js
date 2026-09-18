const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("../config");

function applySecurity(app) {
  app.use(helmet());

  const maxRequests = config.env === "production" ? config.rateLimit.max : Math.max(config.rateLimit.max, 10000);

  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: maxRequests,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests, please try again later." }
    })
  );
}

module.exports = applySecurity;
