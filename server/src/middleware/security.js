const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("../config");

function applySecurity(app) {
  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests, please try again later." }
    })
  );
}

module.exports = applySecurity;
